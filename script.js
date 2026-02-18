document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('leadForm');
    const messageDiv = document.getElementById('formMessage');
    const submitBtn = form.querySelector('.submit-btn');
    
    // בדיקה אם הטופס כבר נשלח ב-24 השעות האחרונות
    const submissionKey = 'leadSubmissionTime';
    const oneDay = 24 * 60 * 60 * 1000; // 24 שעות במילישניות
    const lastSubmission = localStorage.getItem(submissionKey);

    if (lastSubmission) {
        const timePassed = Date.now() - parseInt(lastSubmission, 10);
        if (timePassed < oneDay) {
            // הטופס נשלח לאחרונה - נסתיר אותו ונציג הודעה
            hideFormAndShowMessage();
        } else {
            // עבר תוקף - נמחק את הרישום הישן
            localStorage.removeItem(submissionKey);
        }
    }

    function hideFormAndShowMessage() {
        form.style.display = 'none';
        messageDiv.textContent = 'קיבלנו את הפנייה שלך! נציג מטעמנו יחזור אליך בהקדם האפשרי. תודה שבחרת בנו.';
        messageDiv.classList.remove('hidden', 'error');
        messageDiv.classList.add('success');
        // נשאיר את ההודעה מוצגת קבוע במקרה הזה
    }

    form.addEventListener('submit', async function(e) {
        e.preventDefault();

        // קבלת הערכים מהטופס
        const name = document.getElementById('name').value;
        const phone = document.getElementById('phone').value;
        const email = document.getElementById('email').value; // שדה חדש שהוספנו
        const city = document.getElementById('city').value; // משמש כ"הערות" או note

        // ולידציה בסיסית
        if (phone.length < 9) {
            alert('נא להזין מספר טלפון תקין');
            return;
        }

        // שינוי מצב כפתור לשולח...
        const originalBtnText = submitBtn.textContent;
        submitBtn.textContent = 'שולח...';
        submitBtn.disabled = true;
        messageDiv.classList.add('hidden');
        messageDiv.classList.remove('success', 'error');

        // הכנת הנתונים לשליחה בהתאם ל-API
        const payload = {
            name: name.trim(),
            phone: phone.trim(),
            email: email.trim(),
            note: city.trim(), // שימוש בשדה העיר כהערה
            clientUrl: 'parquets.etai.co.il' // זיהוי האתר השולח
        };

        try {
            const res = await fetch('https://api.etai.co.il/api/leads/create', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (!res.ok) {
                const data = await res.json();
                console.error('❌ Server error:', data);
                throw new Error(data.message || 'שגיאה בשליחת הטופס');
            }

            // הצגת הודעת הצלחה
            console.log('Lead Submitted Successfully');
            
            // שמירת זמן השליחה ב-localStorage
            localStorage.setItem(submissionKey, Date.now().toString());
            
            // הסתרת הטופס והצגת הודעת תודה קבועה
            hideFormAndShowMessage();
            
            // איפוס הטופס (למקרה שהמשתמש ינקה קאש וירצה לשלוח שוב)
            form.reset();

        } catch (err) {
            console.error('❌ Network error:', err);
            messageDiv.textContent = 'אירעה שגיאה, נסה שוב מאוחר יותר.';
            messageDiv.classList.remove('hidden');
            messageDiv.classList.add('error'); // נוסיף סגנון לשגיאה ב-CSS אם צריך
        } finally {
            // החזרת הכפתור למצב רגיל (רלוונטי רק אם הייתה שגיאה, כי בהצלחה הטופס מוסתר)
            if (!messageDiv.classList.contains('success')) {
                submitBtn.textContent = originalBtnText;
                submitBtn.disabled = false;
            }
        }
    });
});