// Client-side JavaScript for contact form enhancement
document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contact-form');
    const submitButton = document.querySelector('.btn[type="submit"]');
    const originalButtonText = submitButton.textContent;
    
    // Function to show loading state
    function setLoadingState(isLoading) {
        if (isLoading) {
            submitButton.textContent = 'Sending...';
            submitButton.disabled = true;
            submitButton.style.opacity = '0.6';
        } else {
            submitButton.textContent = originalButtonText;
            submitButton.disabled = false;
            submitButton.style.opacity = '1';
        }
    }
    
    // Function to show message to user
    function showMessage(message, isError = false) {
        // Remove existing message
        const existingMessage = document.querySelector('.form-message');
        if (existingMessage) {
            existingMessage.remove();
        }
        
        // Create new message element
        const messageDiv = document.createElement('div');
        messageDiv.className = `form-message ${isError ? 'error' : 'success'}`;
        messageDiv.textContent = message;
        
        // Insert message before the form
        contactForm.parentNode.insertBefore(messageDiv, contactForm);
        
        // Scroll to message
        messageDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
        
        // Auto-hide success messages after 5 seconds
        if (!isError) {
            setTimeout(() => {
                messageDiv.style.transition = 'opacity 0.5s';
                messageDiv.style.opacity = '0';
                setTimeout(() => messageDiv.remove(), 500);
            }, 5000);
        }
    }
    
    // Enhanced form submission with AJAX
    contactForm.addEventListener('submit', async function(e) {
        e.preventDefault(); // Prevent default form submission
        
        const formData = new FormData(contactForm);
        const data = {
            name: formData.get('name'),
            email: formData.get('email'),
            message: formData.get('message')
        };
        
        // Basic client-side validation
        if (!data.name || !data.email || !data.message) {
            showMessage('Please fill in all fields.', true);
            return;
        }
        
        try {
            setLoadingState(true);
            
            // Send AJAX request to our API endpoint
            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            });
            
            const result = await response.json();
            
            if (result.success) {
                showMessage(result.message);
                contactForm.reset(); // Clear the form
            } else {
                showMessage(result.message, true);
            }
            
        } catch (error) {
            console.error('Error submitting form:', error);
            showMessage('Network error. Please check your connection and try again.', true);
            
        } finally {
            setLoadingState(false);
        }
    });
    
    // Example of using callbacks (older async pattern)
    function validateEmailWithCallback(email, callback) {
        // Simulate async email validation
        setTimeout(() => {
            const isValid = email.includes('@') && email.includes('.');
            callback(isValid);
        }, 500);
    }
    
    // Example of using Promises (middle async pattern)
    function validateEmailWithPromise(email) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const isValid = email.includes('@') && email.includes('.');
                if (isValid) {
                    resolve(true);
                } else {
                    reject(new Error('Invalid email format'));
                }
            }, 500);
        });
    }
    
    // Example of using async/await (modern async pattern)
    async function validateEmailModern(email) {
        // Simulate async operation
        await new Promise(resolve => setTimeout(resolve, 500));
        
        if (!email.includes('@') || !email.includes('.')) {
            throw new Error('Invalid email format');
        }
        
        return true;
    }
    
    // Real-time email validation example
    const emailInput = document.getElementById('email');
    let validationTimeout;
    
    emailInput.addEventListener('input', function() {
        clearTimeout(validationTimeout);
        
        // Debounce validation (wait for user to stop typing)
        validationTimeout = setTimeout(async () => {
            const email = this.value;
            
            if (email.length > 0) {
                try {
                    await validateEmailModern(email);
                    this.style.borderColor = '#28a745'; // Green
                } catch (error) {
                    this.style.borderColor = '#dc3545'; // Red
                }
            } else {
                this.style.borderColor = ''; // Reset
            }
        }, 1000);
    });
});

// Demonstrate different async patterns for educational purposes
console.log('🔄 Demonstrating async patterns...');

// 1. Callback pattern (older)
console.log('1. Callback pattern:');
function fetchDataWithCallback(callback) {
    setTimeout(() => {
        callback(null, 'Data from callback');
    }, 1000);
}

fetchDataWithCallback((error, data) => {
    if (error) {
        console.error('Callback error:', error);
    } else {
        console.log('Callback result:', data);
    }
});

// 2. Promise pattern (middle)
console.log('2. Promise pattern:');
function fetchDataWithPromise() {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve('Data from promise');
        }, 1500);
    });
}

fetchDataWithPromise()
    .then(data => console.log('Promise result:', data))
    .catch(error => console.error('Promise error:', error));

// 3. Async/await pattern (modern)
console.log('3. Async/await pattern:');
async function fetchDataModern() {
    try {
        // Simulate async operation
        await new Promise(resolve => setTimeout(resolve, 2000));
        return 'Data from async/await';
    } catch (error) {
        throw new Error('Async/await error');
    }
}

// Use the async function
(async () => {
    try {
        const data = await fetchDataModern();
        console.log('Async/await result:', data);
    } catch (error) {
        console.error('Async/await error:', error);
    }
})();