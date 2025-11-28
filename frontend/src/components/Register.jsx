import { Link, useNavigate } from "react-router-dom";
import { useState, useRef } from "react";
import "../styles/Register.css";

function Register() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    contact: "",
    role: "student",
    profilePhoto: null,
    // Student fields
    studentId: "",
    department: "",
    year: "",
    // Faculty fields
    employeeId: "",
    facultyDepartment: "",
    designation: "",
    // Admin fields
    adminCode: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [photoPreview, setPhotoPreview] = useState(null);
  const fileInputRef = useRef(null);

  const validateEmail = (email) => {
    return email.endsWith('@sigce.edu') || email.endsWith('@university.edu');
  };

  const handlePhotoUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Check file type
      if (!file.type.startsWith('image/')) {
        setError("Please upload an image file");
        return;
      }
      
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError("Image size should be less than 5MB");
        return;
      }

      setFormData({ ...formData, profilePhoto: file });
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setPhotoPreview(e.target.result);
      };
      reader.readAsDataURL(file);
      setError("");
    }
  };

  const handleRemovePhoto = () => {
    setFormData({ ...formData, profilePhoto: null });
    setPhotoPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!validateEmail(formData.email)) {
      setError("Please use your university email address (@sigce.edu)");
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long");
      setLoading(false);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    if (formData.role === 'admin' && formData.adminCode !== "CAMPUS2024") {
      setError("Invalid admin access code");
      setLoading(false);
      return;
    }

    try {
      // Create FormData for file upload
      const submitData = new FormData();
      submitData.append('name', formData.name);
      submitData.append('email', formData.email);
      submitData.append('password', formData.password);
      submitData.append('contact', formData.contact);
      submitData.append('role', formData.role);
      
      if (formData.profilePhoto) {
        submitData.append('profilePhoto', formData.profilePhoto);
      }

      // Add role-specific fields
      if (formData.role === 'student') {
        submitData.append('studentId', formData.studentId);
        submitData.append('department', formData.department);
        submitData.append('year', formData.year);
      } else if (formData.role === 'faculty') {
        submitData.append('employeeId', formData.employeeId);
        submitData.append('facultyDepartment', formData.facultyDepartment);
        submitData.append('designation', formData.designation);
      } else if (formData.role === 'admin') {
        submitData.append('adminCode', formData.adminCode);
      }

      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        body: submitData
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        navigate("/feed");
      } else {
        setError(data.message || 'Registration failed. Please try again.');
      }
    } catch (error) {
      setError('Network error: Unable to connect to server.');
    } finally {
      setLoading(false);
    }
  };

  const nextStep = () => {
    if (step === 1) {
      if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword || !formData.contact) {
        setError("Please fill all fields");
        return;
      }
      if (!validateEmail(formData.email)) {
        setError("Please use your university email address");
        return;
      }
      if (formData.password !== formData.confirmPassword) {
        setError("Passwords do not match");
        return;
      }
      setStep(2);
      setError("");
    } else if (step === 2) {
      setStep(3);
      setError("");
    } else if (step === 3) {
      setStep(4);
      setError("");
    }
  };

  const prevStep = () => {
    setStep(step - 1);
    setError("");
  };

  const handleRoleSelect = (role) => {
    setFormData({ ...formData, role });
  };

  const skipPhoto = () => {
    setStep(4);
    setError("");
  };

  return (
    <div className="register-page-container">
      <form className="register-form" onSubmit={step === 4 ? handleRegister : (e) => { e.preventDefault(); nextStep(); }}>
        
        <div className="form-header">
          <div className="logo">🎓 CampusConnect</div>
          <div className="progress-steps">
            <div className={`step ${step >= 1 ? 'active' : ''}`}>1</div>
            <div className="step-line"></div>
            <div className={`step ${step >= 2 ? 'active' : ''}`}>2</div>
            <div className="step-line"></div>
            <div className={`step ${step >= 3 ? 'active' : ''}`}>3</div>
            <div className="step-line"></div>
            <div className={`step ${step >= 4 ? 'active' : ''}`}>4</div>
          </div>
        </div>

        <div className="form-title">
          {step === 1 && "Create Your Account"}
          {step === 2 && "Select Your Role"}
          {step === 3 && "Add Profile Picture"}
          {step === 4 && "Complete Your Profile"}
        </div>

        <div className="form-subtitle">
          {step === 1 && "Join your campus community"}
          {step === 2 && "Choose how you'll use the platform"}
          {step === 3 && "Help others recognize you"}
          {step === 4 && "Add your professional details"}
        </div>
        
        {error && <div className="error-message">{error}</div>}

        {/* STEP 1: BASIC INFO */}
        {step === 1 && (
          <div className="step-content">
            <div className="input-group">
              <label>Full Name</label>
              <input 
                type="text" 
                className="register-input" 
                placeholder="Enter your full name" 
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                required
              />
            </div>

            <div className="input-group">
              <label>University Email</label>
              <input 
                type="email" 
                className="register-input" 
                placeholder="your.name@sigce.edu" 
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                required
              />
            </div>

            <div className="input-group">
              <label>Password</label>
              <input 
                type="password" 
                className="register-input" 
                placeholder="Create a strong password" 
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                required
                minLength={6}
              />
            </div>

            <div className="input-group">
              <label>Confirm Password</label>
              <input 
                type="password" 
                className="register-input" 
                placeholder="Re-enter your password" 
                value={formData.confirmPassword}
                onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                required
              />
            </div>

            <div className="input-group">
              <label>Contact Number</label>
              <input 
                type="tel" 
                className="register-input" 
                placeholder="+91 9876543210" 
                value={formData.contact}
                onChange={(e) => setFormData({...formData, contact: e.target.value})}
                required
              />
            </div>
          </div>
        )}

        {/* STEP 2: ROLE SELECTION */}
        {step === 2 && (
          <div className="step-content">
            <div className="role-selection">
              <div className="role-label">I am a:</div>
              <div className="role-cards">
                <div 
                  className={`role-card ${formData.role === 'student' ? 'active' : ''}`}
                  onClick={() => handleRoleSelect('student')}
                >
                  <div className="role-icon">🎓</div>
                  <div className="role-info">
                    <div className="role-title">Student</div>
                    <div className="role-desc">Currently enrolled student</div>
                  </div>
                </div>

                <div 
                  className={`role-card ${formData.role === 'faculty' ? 'active' : ''}`}
                  onClick={() => handleRoleSelect('faculty')}
                >
                  <div className="role-icon">👨‍🏫</div>
                  <div className="role-info">
                    <div className="role-title">Faculty</div>
                    <div className="role-desc">Teaching staff member</div>
                  </div>
                </div>

                <div 
                  className={`role-card ${formData.role === 'admin' ? 'active' : ''}`}
                  onClick={() => handleRoleSelect('admin')}
                >
                  <div className="role-icon">⚙️</div>
                  <div className="role-info">
                    <div className="role-title">Admin</div>
                    <div className="role-desc">Platform administrator</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: PROFILE PICTURE UPLOAD */}
        {step === 3 && (
          <div className="step-content">
            <div className="photo-upload-section">
              <div className="upload-title">Add Your Profile Picture</div>
              <div className="upload-subtitle">
                Help your campus community recognize you
              </div>

              <div className="upload-area">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handlePhotoUpload}
                  accept="image/*"
                  className="file-input"
                  id="profilePhoto"
                />
                
                {photoPreview ? (
                  <div className="photo-preview">
                    <img src={photoPreview} alt="Preview" className="preview-image" />
                    <button 
                      type="button" 
                      className="remove-photo-btn"
                      onClick={handleRemovePhoto}
                    >
                      ✕ Remove
                    </button>
                  </div>
                ) : (
                  <label htmlFor="profilePhoto" className="upload-box">
                    <div className="upload-icon">📸</div>
                    <div className="upload-text">
                      <div className="upload-main">Click to upload photo</div>
                      <div className="upload-hint">or drag and drop</div>
                      <div className="upload-size">PNG, JPG up to 5MB</div>
                    </div>
                  </label>
                )}
              </div>

              <div className="skip-section">
                <button 
                  type="button" 
                  className="skip-btn"
                  onClick={skipPhoto}
                >
                  Skip for now - I'll add later
                </button>
              </div>
            </div>
          </div>
        )}

        {/* STEP 4: ROLE-SPECIFIC DETAILS */}
        {step === 4 && (
          <div className="step-content">
            <div className="role-section">
              <div className="section-title">
                {formData.role === 'student' && "Student Information"}
                {formData.role === 'faculty' && "Faculty Information"}
                {formData.role === 'admin' && "Admin Verification"}
              </div>
              
              {/* STUDENT FIELDS */}
              {formData.role === 'student' && (
                <div className="form-grid">
                  <div className="input-group">
                    <label>Student ID</label>
                    <input 
                      type="text" 
                      className="register-input" 
                      placeholder="Enter your student ID" 
                      value={formData.studentId}
                      onChange={(e) => setFormData({...formData, studentId: e.target.value})}
                      required
                    />
                  </div>

                  <div className="input-group">
                    <label>Department</label>
                    <select 
                      className="register-input"
                      value={formData.department}
                      onChange={(e) => setFormData({...formData, department: e.target.value})}
                      required
                    >
                      <option value="">Select Department</option>
                      <option value="Computer Engineering">Computer Engineering</option>
                      <option value="Information Technology">Information Technology</option>
                      <option value="Electronics & Telecommunication">Electronics & Telecommunication</option>
                      <option value="Mechanical Engineering">Mechanical Engineering</option>
                      <option value="Civil Engineering">Civil Engineering</option>
                    </select>
                  </div>

                  <div className="input-group">
                    <label>Academic Year</label>
                    <select 
                      className="register-input"
                      value={formData.year}
                      onChange={(e) => setFormData({...formData, year: e.target.value})}
                      required
                    >
                      <option value="">Select Year</option>
                      <option value="First Year">First Year</option>
                      <option value="Second Year">Second Year</option>
                      <option value="Third Year">Third Year</option>
                      <option value="Fourth Year">Fourth Year</option>
                      <option value="Postgraduate">Postgraduate</option>
                    </select>
                  </div>
                </div>
              )}

              {/* FACULTY FIELDS */}
              {formData.role === 'faculty' && (
                <div className="form-grid">
                  <div className="input-group">
                    <label>Employee ID</label>
                    <input 
                      type="text" 
                      className="register-input" 
                      placeholder="Enter your employee ID" 
                      value={formData.employeeId}
                      onChange={(e) => setFormData({...formData, employeeId: e.target.value})}
                      required
                    />
                  </div>

                  <div className="input-group">
                    <label>Department</label>
                    <select 
                      className="register-input"
                      value={formData.facultyDepartment}
                      onChange={(e) => setFormData({...formData, facultyDepartment: e.target.value})}
                      required
                    >
                      <option value="">Select Department</option>
                      <option value="Computer Engineering">Computer Engineering</option>
                      <option value="Information Technology">Information Technology</option>
                      <option value="Electronics & Telecommunication">Electronics & Telecommunication</option>
                      <option value="Mechanical Engineering">Mechanical Engineering</option>
                      <option value="Civil Engineering">Civil Engineering</option>
                    </select>
                  </div>

                  <div className="input-group">
                    <label>Designation</label>
                    <select 
                      className="register-input"
                      value={formData.designation}
                      onChange={(e) => setFormData({...formData, designation: e.target.value})}
                      required
                    >
                      <option value="">Select Designation</option>
                      <option value="Professor">Professor</option>
                      <option value="Associate Professor">Associate Professor</option>
                      <option value="Assistant Professor">Assistant Professor</option>
                      <option value="Head of Department">Head of Department</option>
                      <option value="Lab Incharge">Lab Incharge</option>
                    </select>
                  </div>
                </div>
              )}

              {/* ADMIN FIELDS */}
              {formData.role === 'admin' && (
                <div className="admin-verification">
                  <div className="verification-note">
                    🔒 Admin access requires special authorization
                  </div>
                  <div className="input-group">
                    <label>Admin Access Code</label>
                    <input 
                      type="password" 
                      className="register-input" 
                      placeholder="Enter admin access code" 
                      value={formData.adminCode}
                      onChange={(e) => setFormData({...formData, adminCode: e.target.value})}
                      required
                    />
                    <div className="code-hint">Contact system administrator for the access code</div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* BUTTONS */}
        <div className="form-actions">
          {step > 1 && (
            <button 
              type="button" 
              className="btn-secondary"
              onClick={prevStep}
            >
              ← Back
            </button>
          )}
          <button 
            className="btn-primary"
            type="submit"
            disabled={loading}
          >
            {loading ? (
              <>
                <div className="spinner"></div>
                Processing...
              </>
            ) : (
              step === 1 ? 'Continue →' :
              step === 2 ? 'Continue →' :
              step === 3 ? 'Continue →' :
              'Create Account'
            )}
          </button>
        </div>

        <div className="form-footer">
          Already have an account? <Link to="/" className="auth-link">Sign in here</Link>
        </div>
      </form>
    </div>
  );
}

export default Register;