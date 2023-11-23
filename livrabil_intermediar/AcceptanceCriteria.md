# Acceptance Criteria

### A guest enters the site

**Given** a guest enters the website<br>
**When** the response is fully served<br>
**Then** the guest must see an introductory page.<br>
<br>

### A guest registers successfully

**Given** a guest is on the registration page<br>
**When** he enters the registration data and clicks on submit button<br>
**Then** a new account is created with the inserted data.<br>
<br>

### There is another account with the same email

**Given** a guest is on the registration page and there is another account with the same email<br>
**When** he clicks on the submit button<br>
**Then** he sees the error message "There is already a registered account with the email _entered email address_".<br>
<br>

### A registered user logs into his account

**Given** a registered user is on the login page and he entered his login data<br>
**When** he clicks on the submit button<br>
**Then** he is logged in and redirected to the introductory page.<br>
<br>

### Email or password incorrect at login

**Given** a registered user is on the login page and he entered a wrong email or password<br>
**When** he clicks on the submit button<br>
**Then** he sees an error message corresponding to the situation and stays on the login page.<br>
<br>

### Registered user edits his personal data

**Given** a logged in user is on the manage account page and has completed the updated info<br>
**When** he clicks on the submit button<br>
**Then** the information is updated in the database and the page is reloaded with the new details.<br>
<br>

### Registered user enters invalid update info

**Given** a logged in user is on the manage account page and has completed the invalid update info (first/last name contain something else than letters, spaces, digits and dashes or the new password does not meet the requirements)<br>
**When** he clicks on the submit button<br>
**Then** he sees an error message corresponding to the case they are in and stay on the manage account page.<br>
<br>

### Registered user deletes his account

**Given** a logged in user is on the manage account page and has entered his password for account deletion<br>
**When** he clicks the "Delete Account" button<br>
**Then** the account is deleted from the database, the user is logged out and redirected to the introductory page as a guest.<br>
<br>

### Password is not correct when deleting the account

**Given** a logged in user is on the manage account page and has entered a wrong password for account deletion<br>
**When** he clicks on the "Delete Account" button<br>
**Then** he sees the message error "Incorrect Password" and stays on the manage account page.<br>
<br>
