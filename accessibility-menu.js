(function() {
    // 1. הזרקת CSS עבור תפריט הנגישות
    const style = document.createElement('style');
    style.textContent = `
        #accessibility-btn {
            position: fixed;
            top: 20%;
            left: 0;
            z-index: 10000;
            background: #007bff;
            color: white;
            border: none;
            padding: 10px;
            border-top-right-radius: 5px;
            border-bottom-right-radius: 5px;
            cursor: pointer;
            box-shadow: 2px 2px 5px rgba(0,0,0,0.2);
            font-size: 24px;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        #accessibility-btn:hover, #accessibility-btn:focus {
            background: #0056b3;
            outline: 2px solid #fff;
        }

        #accessibility-menu {
            position: fixed;
            top: 20%;
            left: 50px; /* צמוד לכפתור */
            z-index: 10000;
            background: #fff;
            border: 1px solid #ccc;
            border-radius: 5px;
            box-shadow: 0 0 10px rgba(0,0,0,0.2);
            padding: 15px;
            width: 250px;
            display: none; /* מוסתר כברירת מחדל */
            color: #333;
            font-family: Arial, sans-serif;
            text-align: right;
        }

        #accessibility-menu.visible {
            display: block;
        }

        #accessibility-menu h3 {
            margin: 0 0 15px 0;
            font-size: 1.1rem;
            border-bottom: 1px solid #eee;
            padding-bottom: 10px;
            text-align: center;
        }

        .access-option {
            display: block;
            width: 100%;
            padding: 8px;
            margin-bottom: 5px;
            background: #f4f4f4;
            border: 1px solid #ddd;
            border-radius: 4px;
            cursor: pointer;
            text-align: right;
            font-size: 0.9rem;
            transition: background 0.2s;
        }

        .access-option:hover, .access-option:focus {
            background: #e9e9e9;
            outline: 2px solid #007bff;
        }

        .access-option.active {
            background: #d4edda;
            border-color: #c3e6cb;
            font-weight: bold;
        }

        #access-close {
            position: absolute;
            top: 5px;
            left: 5px;
            background: none;
            border: none;
            font-size: 1.2rem;
            cursor: pointer;
            color: #999;
        }

        /* Accessibility Classes */
        .access-large-font { font-size: 120% !important; }
        .access-huge-font { font-size: 150% !important; }
        
        .access-grayscale { filter: grayscale(100%) !important; }
        
        .access-high-contrast {
            background-color: #000 !important;
            color: #fff !important;
        }
        .access-high-contrast * {
            background-color: #000 !important;
            color: #fff !important;
            border-color: #fff !important;
        }
        
        .access-links-underline a { text-decoration: underline !important; }
        
        .access-readable-font { font-family: Arial, sans-serif !important; }
    `;
    document.head.appendChild(style);

    // 2. יצירת הכפתור והתפריט ב-HTML
    const btn = document.createElement('button');
    btn.id = 'accessibility-btn';
    btn.setAttribute('aria-label', 'פתח תפריט נגישות');
    btn.innerHTML = '♿';
    document.body.appendChild(btn);

    const menu = document.createElement('div');
    menu.id = 'accessibility-menu';
    menu.setAttribute('role', 'dialog');
    menu.setAttribute('aria-modal', 'true');
    menu.setAttribute('aria-labelledby', 'access-title');
    menu.innerHTML = `
        <button id="access-close" aria-label="סגור תפריט">✕</button>
        <h3 id="access-title">כלי נגישות</h3>
        <button class="access-option" id="btn-increase-font">A+ הגדל טקסט</button>
        <button class="access-option" id="btn-decrease-font">A- הקטן טקסט</button>
        <button class="access-option" id="btn-grayscale">גווני אפור</button>
        <button class="access-option" id="btn-contrast">ניגודיות גבוהה</button>
        <button class="access-option" id="btn-links">הדגשת קישורים</button>
        <button class="access-option" id="btn-font">פונט קריא</button>
        <button class="access-option" id="btn-reset" style="margin-top: 10px; border-color: #f5c6cb; background: #f8d7da;">איפוס הגדרות</button>
        <div style="margin-top: 10px; font-size: 0.8rem; text-align: center;">
            <a href="accessibility.html" style="color: #007bff;">הצהרת נגישות</a>
        </div>
    `;
    document.body.appendChild(menu);

    // 3. הוספת לוגיקה (Event Listeners)
    const body = document.body;
    let fontSizeLevel = 0; // 0 = normal, 1 = large, 2 = huge

    // פתיחה/סגירה של התפריט
    btn.addEventListener('click', () => {
        menu.classList.toggle('visible');
        if (menu.classList.contains('visible')) {
            document.getElementById('access-close').focus();
        }
    });

    document.getElementById('access-close').addEventListener('click', () => {
        menu.classList.remove('visible');
        btn.focus();
    });

    // גודל טקסט
    document.getElementById('btn-increase-font').addEventListener('click', () => {
        if (fontSizeLevel < 2) {
            fontSizeLevel++;
            updateFontSize();
        }
    });

    document.getElementById('btn-decrease-font').addEventListener('click', () => {
        if (fontSizeLevel > 0) {
            fontSizeLevel--;
            updateFontSize();
        }
    });

    function updateFontSize() {
        body.classList.remove('access-large-font', 'access-huge-font');
        if (fontSizeLevel === 1) body.classList.add('access-large-font');
        if (fontSizeLevel === 2) body.classList.add('access-huge-font');
    }

    // גווני אפור
    document.getElementById('btn-grayscale').addEventListener('click', function() {
        body.classList.toggle('access-grayscale');
        this.classList.toggle('active');
    });

    // ניגודיות גבוהה
    document.getElementById('btn-contrast').addEventListener('click', function() {
        body.classList.toggle('access-high-contrast');
        this.classList.toggle('active');
    });

    // הדגשת קישורים
    document.getElementById('btn-links').addEventListener('click', function() {
        body.classList.toggle('access-links-underline');
        this.classList.toggle('active');
    });

    // פונט קריא
    document.getElementById('btn-font').addEventListener('click', function() {
        body.classList.toggle('access-readable-font');
        this.classList.toggle('active');
    });

    // איפוס
    document.getElementById('btn-reset').addEventListener('click', () => {
        body.className = ''; // מסיר את כל הקלאסים מה-body
        fontSizeLevel = 0;
        document.querySelectorAll('.access-option').forEach(btn => btn.classList.remove('active'));
    });

})();