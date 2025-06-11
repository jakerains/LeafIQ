import 'jsr:@supabase/functions-js/edge-runtime.d.ts';
import { createClient } from 'npm:@supabase/supabase-js@2.49.1';

const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);

interface PasswordResetRequest {
  action: 'reset_password' | 'send_reset_email' | 'get_user_info';
  user_id: string;
  new_password?: string;
  email?: string;
}

interface ApiResponse {
  success: boolean;
  message: string;
  data?: any;
  error?: string;
}

Deno.serve(async (req: Request): Promise<Response> => {
  try {
    // Handle CORS preflight requests
    if (req.method === 'OPTIONS') {
      return new Response(null, {
        status: 204,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
        },
      });
    }

    // Only allow POST requests
    if (req.method !== 'POST') {
      return createErrorResponse('Method not allowed', 405);
    }

    // Verify authorization
    const authHeader = req.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return createErrorResponse('Missing or invalid authorization header', 401);
    }

    const token = authHeader.split('Bearer ')[1];
    
    // Verify the JWT token and check if user is super admin
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    
    if (authError || !user) {
      return createErrorResponse('Invalid authentication token', 401);
    }

    // Check if user has super_admin role
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('role')
      .eq('user_id', user.id)
      .single();

    if (profileError || !profile || profile.role !== 'super_admin') {
      return createErrorResponse('Access denied. Super admin privileges required.', 403);
    }

    // Parse request body
    const body: PasswordResetRequest = await req.json();
    
    if (!body.action || !body.user_id) {
      return createErrorResponse('Missing required fields: action and user_id', 400);
    }

    // Handle different actions
    let response: ApiResponse;

    switch (body.action) {
      case 'get_user_info':
        response = await getUserInfo(body.user_id);
        break;
      
      case 'send_reset_email':
        response = await sendResetEmail(body.user_id);
        break;
      
      case 'reset_password':
        if (!body.new_password) {
          return createErrorResponse('Missing new_password for reset_password action', 400);
        }
        response = await resetPassword(body.user_id, body.new_password);
        break;
      
      default:
        return createErrorResponse('Invalid action', 400);
    }

    return new Response(JSON.stringify(response), {
      status: response.success ? 200 : 400,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });

  } catch (error) {
    console.error('Error in user-management function:', error);
    return createErrorResponse('Internal server error', 500);
  }
});

async function getUserInfo(userId: string): Promise<ApiResponse> {
  try {
    const { data: userData, error: userError } = await supabase.auth.admin.getUserById(userId);
    
    if (userError) {
      return {
        success: false,
        message: 'Failed to get user info',
        error: userError.message
      };
    }

    if (!userData?.user) {
      return {
        success: false,
        message: 'User not found',
        error: 'User does not exist'
      };
    }

    return {
      success: true,
      message: 'User info retrieved successfully',
      data: {
        id: userData.user.id,
        email: userData.user.email,
        created_at: userData.user.created_at,
        last_sign_in_at: userData.user.last_sign_in_at,
        email_confirmed_at: userData.user.email_confirmed_at
      }
    };
  } catch (error) {
    return {
      success: false,
      message: 'Failed to get user info',
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

async function sendResetEmail(userId: string): Promise<ApiResponse> {
  try {
    // First get the user's email
    const { data: userData, error: userError } = await supabase.auth.admin.getUserById(userId);
    
    if (userError || !userData?.user?.email) {
      return {
        success: false,
        message: 'Failed to get user email',
        error: userError?.message || 'User email not found'
      };
    }

    // Send password reset email
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(userData.user.email, {
      redirectTo: `${Deno.env.get('SUPABASE_URL')?.replace('/v1', '')}/auth/reset-password`
    });

    if (resetError) {
      return {
        success: false,
        message: 'Failed to send reset email',
        error: resetError.message
      };
    }

    return {
      success: true,
      message: `Password reset email sent to ${userData.user.email}`,
      data: { email: userData.user.email }
    };
  } catch (error) {
    return {
      success: false,
      message: 'Failed to send reset email',
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

async function resetPassword(userId: string, newPassword: string): Promise<ApiResponse> {
  try {
    // Validate password strength
    if (newPassword.length < 8) {
      return {
        success: false,
        message: 'Password must be at least 8 characters long',
        error: 'Password too short'
      };
    }

    // Update user password using admin API
    const { error: updateError } = await supabase.auth.admin.updateUserById(userId, {
      password: newPassword
    });

    if (updateError) {
      return {
        success: false,
        message: 'Failed to update password',
        error: updateError.message
      };
    }

    return {
      success: true,
      message: 'Password updated successfully',
      data: { user_id: userId }
    };
  } catch (error) {
    return {
      success: false,
      message: 'Failed to update password',
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

function createErrorResponse(message: string, status: number): Response {
  return new Response(JSON.stringify({
    success: false,
    message,
    error: message
  }), {
    status,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    },
  });
} 