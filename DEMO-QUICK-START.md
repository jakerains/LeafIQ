# 🚀 LeafIQ Demo Quick Start Guide

## 🔑 Demo Credentials

**Dispensary Login:**
- **Email:** `demo@leafiq.online`
- **Password:** `demo123`

**Admin Access:**
- **Passkey:** `1234`

## 🔗 Navigation Flow

### 1. Access the Demo
Navigate to: `/app`

### 2. Login
- Use the demo credentials above
- Click "Login to Dispensary"

### 3. Select Kiosk Mode
Choose from three options:

#### 🟢 Customer Kiosk
- **Route:** `/app/kiosk`
- **Features:** Product browsing, AI recommendations, terpene info
- **Access:** Anyone can select this mode

#### 🔵 Employee Kiosk  
- **Route:** `/app/staff`
- **Features:** Inventory management, staff tools, analytics
- **Access:** Anyone can select this mode

#### 🟣 Admin Panel
- **Route:** `/app/admin`
- **Features:** System config, user management, database access
- **Access:** Requires admin passkey (1234)

## 🛡️ Security Features

- **Route Protection:** Each route is protected by user mode
- **Access Control:** Users can only access their selected mode
- **Admin Security:** Admin panel requires additional passkey
- **Session Management:** Persistent login with Supabase Auth

## 🔄 Mode Switching

To switch between modes:
1. Look for mode switcher in navigation (if available)
2. Or logout and login again to select different mode
3. Or navigate back to kiosk selection

## 🧪 Testing the System

Run the test script to verify everything works:
```bash
node test-auth-navigation.js
```

## 📱 Responsive Design

The system works on:
- Desktop computers
- Tablets
- Mobile devices
- Kiosk touchscreens

## 🎯 Quick Demo Flow

1. **Visit:** `/app`
2. **Login:** `demo@leafiq.online` / `demo123`
3. **Select:** Customer Kiosk
4. **Explore:** Product catalog and features
5. **Switch:** Logout → Login → Select Employee Kiosk
6. **Test Admin:** Logout → Login → Select Admin → Enter passkey `1234`

## 🆘 Troubleshooting

**Login Issues:**
- Verify credentials: `demo@leafiq.online` / `demo123`
- Check network connection
- Clear browser cache if needed

**Navigation Issues:**
- Ensure you've selected a kiosk mode
- Check that you're accessing the correct route
- Verify route protection is working as expected

**Admin Access Issues:**
- Confirm passkey is exactly: `1234`
- Make sure you're using the admin modal, not trying to login as admin

---

🎉 **The LeafIQ demo system is ready for use!** Enjoy exploring the cannabis dispensary kiosk experience. 