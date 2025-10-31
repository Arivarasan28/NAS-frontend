# Doctor Leave Management - Frontend Implementation

## 🎨 Overview

Complete React frontend implementation for the Doctor Leave Management system with beautiful, responsive UI components for both doctors and administrators.

## 📦 Files Created

### **Services (1 file)**
1. ✅ `src/services/DoctorLeaveService.js` - API service with 10 methods

### **Doctor Pages (1 file)**
2. ✅ `src/clinic/doctorpages/pages/DoctorLeaveManagement.jsx` - Doctor leave management interface

### **Admin Pages (1 file)**
3. ✅ `src/clinic/adminpages/pages/AdminLeaveManagement.jsx` - Admin leave approval interface

### **Updated Files (3 files)**
4. ✅ `src/App.jsx` - Added routes for leave management
5. ✅ `src/clinic/doctorpages/components/DoctorSidebar.jsx` - Added navigation link
6. ✅ `src/clinic/adminpages/components/AdminSidebar.jsx` - Added navigation link

---

## 🎯 Features Implemented

### **Doctor Features**
- ✅ Request new leave with form validation
- ✅ View leave history with status badges
- ✅ Cancel pending/approved leaves
- ✅ See admin notes and approval details
- ✅ Filter by leave type
- ✅ Beautiful modal for leave requests
- ✅ Real-time status updates
- ✅ Responsive design

### **Admin Features**
- ✅ View all leave requests
- ✅ Filter by status (All, Pending, Approved, Rejected, Cancelled)
- ✅ Search by doctor name or reason
- ✅ Approve/reject leaves with notes
- ✅ Delete leave requests
- ✅ Status counts and statistics
- ✅ Approval modal with leave details
- ✅ Responsive design

---

## 🚀 Routes Added

### Doctor Routes
```javascript
/doctor-leave-management - Doctor leave management page
```

### Admin Routes
```javascript
/admin-leave-management - Admin leave approval page
```

---

## 🎨 UI Components

### **DoctorLeaveManagement Component**

**Features:**
- Header with "Request Leave" button
- Leave request form modal with:
  - Leave type selector (8 types with emojis)
  - Date range picker
  - Half-day checkbox
  - Reason textarea
  - Form validation
- Leave history list with:
  - Status badges (Pending, Approved, Rejected, Cancelled)
  - Leave details (dates, duration, type)
  - Admin notes display
  - Cancel button for pending/approved leaves
  - Empty state message

**Color Scheme:**
- Primary: Blue (#2563EB)
- Success: Green (#10B981)
- Warning: Yellow (#F59E0B)
- Danger: Red (#EF4444)
- Gray shades for backgrounds

### **AdminLeaveManagement Component**

**Features:**
- Header with statistics
- Status filter tabs with counts
- Search bar for filtering
- Approval modal with:
  - Leave details summary
  - Approve/Reject buttons
  - Admin notes textarea
  - Decision submission
- Leave requests list with:
  - Doctor information
  - Leave details
  - Status badges
  - Review button for pending leaves
  - Delete button for all leaves
  - Empty state message

**Interactions:**
- Click "Review" to open approval modal
- Select Approve/Reject decision
- Add optional admin notes
- Submit decision
- Delete leaves with confirmation

---

## 📡 API Integration

### **DoctorLeaveService Methods**

```javascript
// Request leave
requestLeave(leaveData)

// Get doctor's leaves
getLeavesByDoctorId(doctorId)

// Get leaves by status (admin)
getLeavesByStatus(status)

// Get leave by ID
getLeaveById(leaveId)

// Approve/reject leave (admin)
updateLeaveStatus(leaveId, approvalData)

// Cancel leave (doctor)
cancelLeave(leaveId, doctorId)

// Check availability
checkDoctorAvailability(doctorId, date)

// Get leaves by date range
getApprovedLeavesByDateRange(doctorId, startDate, endDate)
getLeavesByDateRange(startDate, endDate)

// Delete leave (admin)
deleteLeave(leaveId)
```

---

## 🎨 Leave Types with Emojis

| Type | Label | Emoji | Color |
|------|-------|-------|-------|
| SICK_LEAVE | Sick Leave | 🤒 | Red |
| VACATION | Vacation | 🏖️ | Blue |
| EMERGENCY | Emergency | 🚨 | Orange |
| CONFERENCE | Conference | 📚 | Purple |
| PERSONAL | Personal | 👤 | Gray |
| MATERNITY | Maternity | 👶 | Pink |
| PATERNITY | Paternity | 👨‍👶 | Indigo |
| OTHER | Other | 📝 | Gray |

---

## 🎭 Status Badges

| Status | Color | Icon |
|--------|-------|------|
| PENDING | Yellow | ⏰ Clock |
| APPROVED | Green | ✓ CheckCircle |
| REJECTED | Red | ✗ XCircle |
| CANCELLED | Gray | ✗ X |

---

## 💻 Usage Examples

### **Doctor: Request Leave**

1. Navigate to `/doctor-leave-management`
2. Click "Request Leave" button
3. Fill in the form:
   - Select leave type
   - Choose start and end dates
   - Optionally check "Half Day"
   - Enter reason
4. Click "Submit Request"
5. Leave appears in history with "Pending" status

### **Doctor: Cancel Leave**

1. View leave in history
2. Click "Cancel Leave" button (available for Pending/Approved)
3. Confirm cancellation
4. Status changes to "Cancelled"

### **Admin: Approve Leave**

1. Navigate to `/admin-leave-management`
2. Click "Pending" tab to filter
3. Click "Review" button on a leave request
4. Review leave details
5. Click "Approve" or "Reject"
6. Add optional admin notes
7. Click "Submit Decision"
8. Leave status updates immediately

### **Admin: Search and Filter**

1. Use status tabs to filter by status
2. Use search bar to find by doctor name or reason
3. Results update in real-time

---

## 🎨 Styling

### **Tailwind CSS Classes Used**

- **Layouts**: `flex`, `grid`, `space-y-*`, `gap-*`
- **Colors**: `bg-blue-600`, `text-white`, `hover:bg-blue-700`
- **Spacing**: `p-6`, `m-4`, `px-4`, `py-2`
- **Borders**: `rounded-lg`, `border`, `border-gray-300`
- **Shadows**: `shadow-md`, `shadow-xl`
- **Typography**: `text-3xl`, `font-bold`, `text-gray-700`
- **Transitions**: `transition-colors`, `hover:*`
- **Responsive**: `md:grid-cols-2`, `max-w-7xl`

### **Icons from Lucide React**

- `Calendar` - Main icon
- `Plus` - Add button
- `X` - Close/Cancel
- `Clock` - Pending status
- `CheckCircle` - Approved status
- `XCircle` - Rejected status
- `AlertCircle` - Error messages
- `Filter` - Filter icon
- `Search` - Search icon
- `Trash2` - Delete icon

---

## 🔧 State Management

### **Doctor Component State**

```javascript
const [leaves, setLeaves] = useState([]);
const [loading, setLoading] = useState(true);
const [showRequestForm, setShowRequestForm] = useState(false);
const [doctorId, setDoctorId] = useState(null);
const [error, setError] = useState('');
const [success, setSuccess] = useState('');
const [leaveRequest, setLeaveRequest] = useState({
  leaveType: 'VACATION',
  startDate: '',
  endDate: '',
  reason: '',
  isHalfDay: false
});
```

### **Admin Component State**

```javascript
const [leaves, setLeaves] = useState([]);
const [filteredLeaves, setFilteredLeaves] = useState([]);
const [loading, setLoading] = useState(true);
const [selectedStatus, setSelectedStatus] = useState('ALL');
const [searchTerm, setSearchTerm] = useState('');
const [error, setError] = useState('');
const [success, setSuccess] = useState('');
const [showApprovalModal, setShowApprovalModal] = useState(false);
const [selectedLeave, setSelectedLeave] = useState(null);
const [approvalData, setApprovalData] = useState({
  status: 'APPROVED',
  adminNotes: ''
});
```

---

## 🚨 Error Handling

### **Error Display**

```javascript
{error && (
  <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded">
    <div className="flex items-center">
      <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
      <p className="text-red-700">{error}</p>
    </div>
  </div>
)}
```

### **Success Display**

```javascript
{success && (
  <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-6 rounded">
    <div className="flex items-center">
      <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
      <p className="text-green-700">{success}</p>
    </div>
  </div>
)}
```

---

## 🔄 Loading States

```javascript
if (loading) {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>
  );
}
```

---

## 📱 Responsive Design

### **Breakpoints**

- Mobile: Default (< 768px)
- Tablet: `md:` (≥ 768px)
- Desktop: `lg:` (≥ 1024px)

### **Responsive Features**

- Grid layouts adapt to screen size
- Modal scrolls on small screens
- Sidebar collapses on mobile
- Touch-friendly buttons
- Readable text sizes

---

## 🎯 Form Validation

### **Leave Request Form**

- **Leave Type**: Required, dropdown selection
- **Start Date**: Required, must be today or future
- **End Date**: Required, must be >= start date
- **Reason**: Required, textarea
- **Half Day**: Optional, checkbox

### **Approval Form**

- **Decision**: Required, Approve or Reject
- **Admin Notes**: Optional, textarea

---

## 🧪 Testing Checklist

### **Doctor Features**
- [ ] Can navigate to leave management page
- [ ] Can open request leave form
- [ ] Can select leave type
- [ ] Can pick dates (validation works)
- [ ] Can toggle half-day option
- [ ] Can enter reason
- [ ] Can submit leave request
- [ ] Can view leave history
- [ ] Can cancel pending leave
- [ ] Can cancel approved leave
- [ ] Can see admin notes
- [ ] Error messages display correctly
- [ ] Success messages display correctly

### **Admin Features**
- [ ] Can navigate to leave management page
- [ ] Can see all leave requests
- [ ] Can filter by status
- [ ] Can search by doctor name
- [ ] Can search by reason
- [ ] Can open approval modal
- [ ] Can approve leave
- [ ] Can reject leave
- [ ] Can add admin notes
- [ ] Can delete leave
- [ ] Status counts update correctly
- [ ] Error messages display correctly
- [ ] Success messages display correctly

---

## 🚀 Getting Started

### **1. Install Dependencies**

```bash
cd /Users/arivarasan/Desktop/nas_spring/NAS-frontend
npm install
```

### **2. Start Development Server**

```bash
npm run dev
```

### **3. Access the Pages**

**Doctor:**
- Login as doctor
- Navigate to "Leave Management" in sidebar
- URL: `http://localhost:5173/doctor-leave-management`

**Admin:**
- Login as admin
- Navigate to "Leave Management" in sidebar
- URL: `http://localhost:5173/admin-leave-management`

---

## 🎨 Customization

### **Change Colors**

Edit the Tailwind classes in the components:

```javascript
// Primary color (currently blue)
className="bg-blue-600 hover:bg-blue-700"

// Change to green
className="bg-green-600 hover:bg-green-700"
```

### **Add More Leave Types**

In both components, update the `leaveTypes` array:

```javascript
const leaveTypes = [
  // ... existing types
  { value: 'STUDY_LEAVE', label: 'Study Leave', icon: '📖' }
];
```

### **Modify Form Fields**

Add new fields to the leave request form:

```javascript
<div>
  <label>New Field</label>
  <input
    type="text"
    value={leaveRequest.newField}
    onChange={(e) => setLeaveRequest({...leaveRequest, newField: e.target.value})}
  />
</div>
```

---

## 🐛 Troubleshooting

### **Issue: "Failed to load leaves"**
**Solution:** Check backend is running and API endpoint is accessible

### **Issue: "Failed to load doctor profile"**
**Solution:** Ensure user is logged in as doctor and has valid JWT token

### **Issue: Navigation link not showing**
**Solution:** Clear browser cache and reload

### **Issue: Form not submitting**
**Solution:** Check all required fields are filled and dates are valid

### **Issue: Modal not closing**
**Solution:** Check for JavaScript errors in console

---

## 📚 Dependencies

### **Required Packages**

```json
{
  "react": "^18.3.1",
  "react-router-dom": "^6.x",
  "axios": "^1.x",
  "lucide-react": "^0.x",
  "react-icons": "^5.x",
  "tailwindcss": "^3.x"
}
```

### **Install Missing Packages**

```bash
npm install lucide-react
```

---

## 🎉 Summary

### **What's Been Implemented**

✅ **3 new files** created (1 service, 2 pages)  
✅ **3 files updated** (App.jsx, 2 sidebars)  
✅ **2 complete UI pages** with full functionality  
✅ **10 API methods** integrated  
✅ **Beautiful responsive design** with Tailwind CSS  
✅ **Form validation** and error handling  
✅ **Real-time updates** and status tracking  
✅ **Role-based access** (Doctor and Admin)  
✅ **Navigation links** added to sidebars  
✅ **Protected routes** configured  

### **Ready to Use**

The frontend is now fully integrated with the backend and ready for testing. Start the backend server, then start the frontend, and you can immediately begin using the leave management features!

---

## 📞 Next Steps

1. ✅ Start backend: `cd NAS-backend && ./mvnw spring-boot:run`
2. ✅ Start frontend: `cd NAS-frontend && npm run dev`
3. ✅ Login as doctor and test leave requests
4. ✅ Login as admin and test leave approvals
5. ✅ Test all features and edge cases
6. ✅ Customize colors and styling if needed
7. ✅ Add email notifications (optional)
8. ✅ Create mobile app version (optional)

**Congratulations! Your doctor leave management system is complete! 🎉**
