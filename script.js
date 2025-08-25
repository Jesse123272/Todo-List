// --- AUTHENTICATION ---
let users = JSON.parse(localStorage.getItem('users')) || [];
let currentUser = localStorage.getItem('currentUser') || null;

// Elements
const signinBtn = document.getElementById('signin-btn');
const signupBtn = document.getElementById('signup-btn');
const showSignup = document.getElementById('show-signup');
const showSignin = document.getElementById('show-signin');

// Toggle Signin/Signup Boxes
if(showSignup){
    showSignup.addEventListener('click', ()=>{
        document.getElementById('signin-box').classList.add('hidden');
        document.getElementById('signup-box').classList.remove('hidden');
    });
}
if(showSignin){
    showSignin.addEventListener('click', ()=>{
        document.getElementById('signup-box').classList.add('hidden');
        document.getElementById('signin-box').classList.remove('hidden');
    });
}

// Sign Up
if(signupBtn){
    signupBtn.addEventListener('click', ()=>{
        const username = document.getElementById('signup-username').value.trim();
        const email = document.getElementById('signup-email').value.trim();
        const password = document.getElementById('signup-password').value;
        const confirm = document.getElementById('signup-confirm').value;
        const agree = document.getElementById('signup-checkbox').checked;

        if(!username || !email || !password || !confirm){
            alert("Fill all fields"); return;
        }
        if(password !== confirm){
            alert("Passwords do not match"); return;
        }
        if(!agree){
            alert("You must agree to Terms before signing up."); return;
        }

        users.push({username,email,password});
        localStorage.setItem('users', JSON.stringify(users));
        alert("Sign up successful! Please Sign In.");
        document.getElementById('signup-box').classList.add('hidden');
        document.getElementById('signin-box').classList.remove('hidden');
    });
}

// Sign In
if(signinBtn){
    signinBtn.addEventListener('click', ()=>{
        const username = document.getElementById('signin-username').value.trim();
        const email = document.getElementById('signin-email').value.trim();
        const password = document.getElementById('signin-password').value;
        const remember = document.getElementById('remember-me')?.checked || false;

        if(!username || !email || !password){
            alert("Fill all fields"); return;
        }
        if(!remember){
            alert("Please check 'Remember Me' to sign in."); return;
        }

        let user = users.find(u => u.username === username && u.email === email && u.password === password);
        if(user){
            localStorage.setItem('currentUser', username);
            window.location.href='dashboard.html';
        } else{
            alert("Invalid credentials");
        }
    });
}

// --- DASHBOARD NAVIGATION ---
const sections = ['dashboard','members','payment'];
sections.forEach(sec=>{
    const btn = document.getElementById('nav-'+sec);
    const secDiv = document.getElementById(sec+'-section');
    if(btn){
        btn.addEventListener('click', ()=>{
            sections.forEach(s=>{
                const d = document.getElementById(s+'-section');
                if(d) d.classList.add('hidden');
            });
            if(secDiv) secDiv.classList.remove('hidden');
        });
    }
});

// --- DARK MODE ---
const darkBtn = document.getElementById('toggle-dark');
if(darkBtn){
    darkBtn.addEventListener('click', ()=>{
        document.body.classList.toggle('dark-mode');
    });
}

// --- LOGOUT ---
const logoutBtn = document.getElementById('logout');
if(logoutBtn){
    logoutBtn.addEventListener('click', ()=>{
        if(confirm("Are you sure you want to log out?")){
            localStorage.removeItem('currentUser');
            alert("Goodbye! You have signed out.");
            window.location.href='index.html';
        }
    });
}

// --- GREETING ---
const greeting = document.getElementById('greeting');
if(greeting && currentUser){
    greeting.innerText = `Welcome, ${currentUser}!`;
}

// --- MEMBERS MANAGEMENT ---
let members = JSON.parse(localStorage.getItem('members')) || [];
let selectedMemberIndex = null;

const membersList = document.getElementById('members-list');
const showAddMemberBtn = document.getElementById('show-add-member');
const addMemberForm = document.getElementById('add-member-form');
const addMemberBtn = document.getElementById('add-member');
const cancelMemberBtn = document.getElementById('cancel-member');
const memberSearchInput = document.getElementById('member-search');
const memberSearchBtn = document.getElementById('member-search-btn');
const memberSortSelect = document.getElementById('member-sort');

function renderMembers(list = members){
    if(!membersList) return;
    membersList.innerHTML='';
    list.forEach((m,i)=>{
        const li = document.createElement('li');
        li.innerHTML = `${m.name} - ${m.desc} <span class="edit-member">✏️</span> <span class="delete-member">🗑️</span>`;

        li.querySelector('.edit-member').addEventListener('click', ()=>{
            if(confirm("Do you want to edit this member?")){
                selectedMemberIndex = i;
                addMemberForm.classList.remove('hidden');
                document.getElementById('member-name').value = m.name;
                document.getElementById('member-dob').value = m.dob;
                document.getElementById('member-desc').value = m.desc;
            }
        });

        li.querySelector('.delete-member').addEventListener('click', ()=>{
            if(confirm("Are you sure you want to delete this member?")){
                members.splice(i,1);
                localStorage.setItem('members', JSON.stringify(members));
                renderMembers();
                updateDashboardStats();
            }
        });
        membersList.appendChild(li);
    });
}
renderMembers();

if (showAddMemberBtn && addMemberForm) {
    showAddMemberBtn.addEventListener('click', () => {
        addMemberForm.classList.remove('hidden');
    });
}
if (addMemberBtn && addMemberForm) {
    addMemberBtn.addEventListener('click', () => {
        const name = document.getElementById('member-name').value.trim();
        const dob = document.getElementById('member-dob').value;
        const desc = document.getElementById('member-desc').value.trim();
        if(!name||!desc){ alert("Fill required fields"); return; }

        if(selectedMemberIndex !== null){
            members[selectedMemberIndex] = {name,dob,desc};
        } else {
            members.push({name,dob,desc});
        }
        localStorage.setItem('members', JSON.stringify(members));
        addMemberForm.classList.add('hidden');
        // Clear form fields
        document.getElementById('member-name').value = '';
        document.getElementById('member-dob').value = '';
        document.getElementById('member-desc').value = '';
        selectedMemberIndex = null;
        renderMembers();
        updateDashboardStats();
    });
}
if (cancelMemberBtn && addMemberForm) {
    cancelMemberBtn.addEventListener('click', () => {
        addMemberForm.classList.add('hidden');
    });
}
if(memberSearchBtn){
    memberSearchBtn.addEventListener('click', ()=>{
        const query = memberSearchInput.value.toLowerCase();
        renderMembers(members.filter(m => m.name.toLowerCase().includes(query) || m.desc.toLowerCase().includes(query)));
    });
}
if(memberSortSelect){
    memberSortSelect.addEventListener('change', ()=>{
        if(memberSortSelect.value === 'name') members.sort((a,b)=>a.name.localeCompare(b.name));
        renderMembers();
    });
}

// --- PAYMENTS MANAGEMENT ---
let payments = JSON.parse(localStorage.getItem('payments')) || [];
let selectedPaymentIndex = null;

const paymentsList = document.getElementById('payment-list');
const showAddPaymentBtn = document.getElementById('show-add-payment');
const addPaymentForm = document.getElementById('add-payment-form');
const addPaymentBtn = document.getElementById('add-payment');
const cancelPaymentBtn = document.getElementById('cancel-payment');
const paymentSearchInput = document.getElementById('payment-search');
const paymentSearchBtn = document.getElementById('payment-search-btn');
const paymentSortSelect = document.getElementById('payment-sort');

function renderPayments(list = payments){
    if(!paymentsList) return;
    paymentsList.innerHTML='';
    list.forEach((p,i)=>{
        const li = document.createElement('li');
        li.innerHTML = `${p.name} - ${p.amount} - ${p.method} <span class="edit-payment">✏️</span> <span class="delete-payment">🗑️</span>`;

        li.querySelector('.edit-payment').addEventListener('click', ()=>{
            if(confirm("Do you want to edit this payment?")){
                selectedPaymentIndex = i;
                addPaymentForm.classList.remove('hidden');
                document.getElementById('payment-name').value = p.name;
                document.getElementById('payment-amount').value = p.amount;
                document.getElementById('payment-desc').value = p.desc;
                document.getElementById('payment-method').value = p.method;
            }
        });
        li.querySelector('.delete-payment').addEventListener('click', ()=>{
            if(confirm("Are you sure you want to delete this payment?")){
                payments.splice(i,1);
                localStorage.setItem('payments', JSON.stringify(payments));
                renderPayments();
                updateDashboardStats();
            }
        });
        paymentsList.appendChild(li);
    });
}
renderPayments();

if (showAddPaymentBtn && addPaymentForm) {
    showAddPaymentBtn.addEventListener('click', () => {
        addPaymentForm.classList.remove('hidden');
    });
}
if (addPaymentBtn && addPaymentForm) {
    addPaymentBtn.addEventListener('click', () => {
        const name = document.getElementById('payment-name').value.trim();
        const amount = document.getElementById('payment-amount').value.trim();
        const desc = document.getElementById('payment-desc').value.trim();
        const method = document.getElementById('payment-method').value;
        if(!name||!amount||!method){ alert("Fill required fields"); return; }

        if(selectedPaymentIndex !== null){
            payments[selectedPaymentIndex] = {name,amount,desc,method};
        } else {
            payments.push({name,amount,desc,method});
        }
        localStorage.setItem('payments', JSON.stringify(payments));
        addPaymentForm.classList.add('hidden');
        // Clear form fields
        document.getElementById('payment-name').value = '';
        document.getElementById('payment-amount').value = '';
        document.getElementById('payment-desc').value = '';
        document.getElementById('payment-method').value = '';
        selectedPaymentIndex = null;
        renderPayments();
        updateDashboardStats();
    });
}
if (cancelPaymentBtn && addPaymentForm) {
    cancelPaymentBtn.addEventListener('click', () => {
        addPaymentForm.classList.add('hidden');
    });
}
if(paymentSearchBtn){
    paymentSearchBtn.addEventListener('click', ()=>{
        const query = paymentSearchInput.value.toLowerCase();
        renderPayments(payments.filter(p => p.name.toLowerCase().includes(query) || p.desc.toLowerCase().includes(query)));
    });
}
if(paymentSortSelect){
    paymentSortSelect.addEventListener('change', ()=>{
        const val = paymentSortSelect.value;
        if(val==='name') payments.sort((a,b)=>a.name.localeCompare(b.name));
        if(val==='amount') payments.sort((a,b)=>parseFloat(a.amount)-parseFloat(b.amount));
        renderPayments();
    });
}

// --- DASHBOARD STATS ---
function updateDashboardStats(){
    const totalMembers = document.getElementById('total-members');
    const totalPayments = document.getElementById('total-payments');
    if(totalMembers) totalMembers.innerText = members.length;
    if(totalPayments) totalPayments.innerText = payments.length;
}
updateDashboardStats();
