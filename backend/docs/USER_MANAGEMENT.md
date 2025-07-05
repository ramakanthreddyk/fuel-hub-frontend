# User Management Guide

## User Roles and Hierarchy

FuelSync has three user roles within each tenant:

1. **Owner**
   - Created automatically when a tenant is created
   - Can manage all users, stations, and data
   - Can create/edit/delete managers and attendants
   - Cannot be deleted if they are the last owner

2. **Manager**
   - Created by the owner
   - Can manage stations, pumps, and sales
   - Can view other users but cannot create/edit/delete them

3. **Attendant**
   - Created by the owner
   - Can record sales and readings
   - Limited access to system features

## Automatic User Creation

When a tenant is created, an owner user is automatically created with:

- **Email**: `owner@tenant-schema-name.fuelsync.com` (underscores replaced with hyphens)
- **Password**: `tenant123`
- **Role**: `owner`

For example, if you create a tenant with schema name `acme_fuels`, the owner's email will be `owner@acme-fuels.fuelsync.com`.

## User Management APIs

### List Users
```
GET /api/v1/users
```

**Response:**
```json
{
  "users": [
    {
      "id": "uuid",
      "email": "owner@tenant-name.com",
      "name": "Tenant Owner",
      "role": "owner",
      "created_at": "2023-01-01T00:00:00Z"
    }
  ]
}
```

### Create User
```
POST /api/v1/users
```

**Request:**
```json
{
  "email": "manager@example.com",
  "password": "password123",
  "name": "John Manager",
  "role": "manager"
}
```

**Response:**
```json
{
  "id": "uuid",
  "email": "manager@example.com",
  "name": "John Manager",
  "role": "manager",
  "created_at": "2023-01-01T00:00:00Z"
}
```

### Update User
```
PUT /api/v1/users/:id
```

**Request:**
```json
{
  "name": "Updated Name",
  "role": "attendant"
}
```

### Change Password (Self)
```
POST /api/v1/users/:id/change-password
```

**Request:**
```json
{
  "currentPassword": "old-password",
  "newPassword": "new-password"
}
```

### Reset Password (Admin)
```
POST /api/v1/users/:id/reset-password
```

**Request:**
```json
{
  "newPassword": "reset-password"
}
```

### Delete User
```
DELETE /api/v1/users/:id
```

## Password Management

### First Login

When a user is first created, they should:
1. Login with the provided credentials
2. Change their password immediately using the change password API

### Password Reset

If a user forgets their password:
1. The owner can reset it using the reset password API
2. The user can then login with the new password
3. The user should change their password immediately

### Security Considerations

- Passwords are stored as bcrypt hashes
- The system enforces role-based access control
- Only owners can create/edit/delete users
- The last owner cannot be deleted

## Frontend Implementation

### User Creation Form

```tsx
function CreateUserForm() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    role: 'manager'
  });
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    await usersApi.createUser(formData);
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Email</label>
        <input 
          type="email" 
          value={formData.email}
          onChange={(e) => setFormData({...formData, email: e.target.value})}
          required
        />
      </div>
      
      <div>
        <label>Password</label>
        <input 
          type="password" 
          value={formData.password}
          onChange={(e) => setFormData({...formData, password: e.target.value})}
          required
        />
      </div>
      
      <div>
        <label>Name</label>
        <input 
          type="text" 
          value={formData.name}
          onChange={(e) => setFormData({...formData, name: e.target.value})}
          required
        />
      </div>
      
      <div>
        <label>Role</label>
        <select 
          value={formData.role}
          onChange={(e) => setFormData({...formData, role: e.target.value})}
          required
        >
          <option value="manager">Manager</option>
          <option value="attendant">Attendant</option>
        </select>
      </div>
      
      <button type="submit">Create User</button>
    </form>
  );
}
```

### Change Password Form

```tsx
function ChangePasswordForm({ userId }) {
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: ''
  });
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    await usersApi.changePassword(userId, formData);
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Current Password</label>
        <input 
          type="password" 
          value={formData.currentPassword}
          onChange={(e) => setFormData({...formData, currentPassword: e.target.value})}
          required
        />
      </div>
      
      <div>
        <label>New Password</label>
        <input 
          type="password" 
          value={formData.newPassword}
          onChange={(e) => setFormData({...formData, newPassword: e.target.value})}
          required
        />
      </div>
      
      <button type="submit">Change Password</button>
    </form>
  );
}
```