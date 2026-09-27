const views = [...document.querySelectorAll(".view")];
const navItems = [...document.querySelectorAll(".nav-item")];
const pageTitle = document.getElementById("pageTitle");
const toast = document.getElementById("toast");
const modal = document.getElementById("modal");
const modalTitle = document.getElementById("modalTitle");
const modalText = document.getElementById("modalText");
const modalForm = document.getElementById("modalForm");
const modalAction = document.getElementById("modalAction");

const titles = {
  dashboard:"Dashboard", atlas:"Talk to Atlas", events:"Events & Projects", tasks:"Tasks",
  budget:"Budget", documents:"Documents", members:"Members", settings:"Settings"
};

function showToast(message){
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(window.toastTimer);
  window.toastTimer = setTimeout(()=>toast.classList.remove("show"), 2800);
}

function navigate(view){
  views.forEach(v=>v.classList.toggle("active", v.id===view));
  navItems.forEach(n=>n.classList.toggle("active", n.dataset.view===view));
  pageTitle.textContent = titles[view] || "Dashboard";
  window.scrollTo({top:0,behavior:"smooth"});
  document.getElementById("sidebar").classList.remove("open");
}
navItems.forEach(item=>item.addEventListener("click",()=>navigate(item.dataset.view)));
document.querySelectorAll("[data-view-target]").forEach(b=>b.addEventListener("click",()=>navigate(b.dataset.viewTarget)));
document.getElementById("openAtlas").addEventListener("click",()=>navigate("atlas"));
document.getElementById("mobileMenu").addEventListener("click",()=>document.getElementById("sidebar").classList.toggle("open"));

function openModal(type){
  modal.classList.add("open");
  modalForm.innerHTML = "";
  if(type==="event"){
    modalTitle.textContent="Create a new project";
    modalText.textContent="Give Atlas the basics. It will create a structured project workspace you can edit.";
    modalForm.innerHTML=`<label>Project name<input id="modalName" placeholder="e.g. General Assembly 2026"></label>
      <label>Purpose<textarea id="modalPurpose" placeholder="What is this project trying to accomplish?"></textarea></label>
      <label>Target date<input id="modalDate" type="date"></label>`;
    modalAction.textContent="Create project";
  } else if(type==="task"){
    modalTitle.textContent="Add a task";
    modalText.textContent="Assign clear ownership and a deadline so nothing gets lost.";
    modalForm.innerHTML=`<label>Task<input id="modalName" placeholder="e.g. Confirm venue"></label>
      <label>Assignee<select id="modalAssignee"><option>Lacy Maglalang</option><option>Alex Reyes</option><option>Jordan Mendoza</option><option>Nina Santos</option></select></label>
      <label>Deadline<input id="modalDate" type="date"></label>`;
    modalAction.textContent="Add task";
  } else if(type==="expense"){
    modalTitle.textContent="Record an expense";
    modalText.textContent="Keep your organization's financial records up to date.";
    modalForm.innerHTML=`<label>Description<input id="modalName" placeholder="e.g. Printing & materials"></label>
      <label>Amount<input id="modalAmount" type="number" placeholder="0.00"></label>
      <label>Project<select id="modalProject"><option>General Assembly</option><option>Freshmen Orientation</option><option>Operations</option></select></label>`;
    modalAction.textContent="Save expense";
  } else {
    modalTitle.textContent="Upload a document";
    modalText.textContent="For this prototype, documents are stored as a simulated workspace item.";
    modalForm.innerHTML=`<label>Document name<input id="modalName" placeholder="e.g. Committee Minutes — Sep 27"></label>
      <label>Category<select><option>Meeting Minutes</option><option>Event Proposal</option><option>Finance</option><option>Policy</option></select></label>`;
    modalAction.textContent="Add document";
  }
}
function closeModal(){modal.classList.remove("open")}
document.getElementById("modalClose").addEventListener("click",closeModal);
modal.addEventListener("click",e=>{if(e.target===modal)closeModal()});
modalAction.addEventListener("click",()=>{
  const name=document.getElementById("modalName")?.value?.trim();
  if(!name){showToast("Please fill in the required field.");return}
  closeModal();
  showToast("Done — your workspace has been updated.");
});

document.getElementById("newEventBtn").addEventListener("click",()=>openModal("event"));
document.getElementById("addTaskBtn").addEventListener("click",()=>openModal("task"));
document.getElementById("expenseBtn").addEventListener("click",()=>openModal("expense"));
document.getElementById("uploadBtn").addEventListener("click",()=>openModal("document"));
document.getElementById("saveSettings").addEventListener("click",()=>showToast("Settings saved successfully."));
document.getElementById("analyzeBtn").addEventListener("click",()=>{
  openModal("analysis");
  modalTitle.textContent="Atlas workload analysis";
  modalText.textContent="I found 4 potential blockers: two urgent proposal tasks, one venue confirmation, and one budget review. Consider assigning the venue task before tomorrow.";
  modalForm.innerHTML=`<div style="background:#f5f3ff;border-radius:12px;padding:13px;font-size:10px;color:#5c526f;line-height:1.6">
  <strong>Suggested next actions</strong><br>1. Confirm the General Assembly venue.<br>2. Finish the proposal before 8:00 PM.<br>3. Review committee budget requests.<br>4. Send minutes for approval.</div>`;
  modalAction.textContent="Got it";
});
document.getElementById("searchBtn").addEventListener("click",()=>showToast("Search is ready — try asking Atlas instead."));
document.getElementById("notifBtn").addEventListener("click",()=>showToast("3 notifications: 2 deadlines and 1 document review."));
document.getElementById("micBtn").addEventListener("click",()=>showToast("Voice input is simulated in this prototype."));

document.querySelectorAll(".toggle").forEach(t=>t.addEventListener("click",()=>t.classList.toggle("on")));
document.querySelectorAll(".suggestion").forEach(s=>s.addEventListener("click",()=>{
  const input=document.getElementById("chatInput");
  input.value=s.textContent;
  input.focus();
}));
document.getElementById("clearChat").addEventListener("click",()=>{
  document.getElementById("messages").innerHTML=`<div class="message atlas-message"><div class="msg-avatar">✦</div><div><div class="bubble">Chat cleared. What would you like to work on?</div><small>Atlas · just now</small></div></div>`;
});
document.getElementById("chatForm").addEventListener("submit",e=>{
  e.preventDefault();
  const input=document.getElementById("chatInput");
  const text=input.value.trim();
  if(!text)return;
  const messages=document.getElementById("messages");
  messages.insertAdjacentHTML("beforeend",`<div class="message user-message" style="margin:18px 0 0 auto;justify-content:flex-end"><div><div class="bubble" style="background:#6d5dfc;color:#fff;border-radius:14px 4px 14px 14px">${escapeHtml(text)}</div><small style="text-align:right">You · just now</small></div></div>`);
  input.value="";
  messages.scrollTop=messages.scrollHeight;
  setTimeout(()=>{
    let reply="I can help with that. I'll turn your request into a structured action plan.";
    const lower=text.toLowerCase();
    if(lower.includes("proposal")) reply="Absolutely. I can draft an event proposal with purpose, objectives, audience, timeline, logistics, and a preliminary budget. What should the event be called?";
    else if(lower.includes("agenda")) reply="I'll structure the agenda around your pending items, previous decisions, and time available. I can also turn the final agenda into meeting minutes afterward.";
    else if(lower.includes("budget")) reply="I can build a budget breakdown by category, compare it with your remaining allocation, and flag items that need approval.";
    else if(lower.includes("timeline")) reply="I can turn the project into milestones, owners, dependencies, and deadlines. I'll also flag tasks that could block the critical path.";
    messages.insertAdjacentHTML("beforeend",`<div class="message atlas-message" style="margin-top:18px"><div class="msg-avatar">✦</div><div><div class="bubble">${reply}</div><small>Atlas · just now</small></div></div>`);
    messages.scrollTop=messages.scrollHeight;
  },650);
});
function escapeHtml(s){return s.replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[m]))}

document.querySelectorAll(".tab").forEach(tab=>tab.addEventListener("click",()=>{
  document.querySelectorAll(".tab").forEach(t=>t.classList.remove("active"));tab.classList.add("active");
  showToast("Project filter updated.");
}));
document.querySelectorAll(".filter").forEach(tab=>tab.addEventListener("click",()=>{
  document.querySelectorAll(".filter").forEach(t=>t.classList.remove("active"));tab.classList.add("active");
  showToast("Task filter updated.");
}));
