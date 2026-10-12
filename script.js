const STORAGE_KEY = "luzLaundryPrototypeDataV1";
const STATUSES = ["Received", "Washing", "Drying", "Folding", "Ready", "Claimed"];
let currentPage = "home";
let toastTimer;

const seedOrders = [
  {id:"001", name:"james lutter", phone:"09171234567", type:"Regular clothes", weight:5, notes:"Separate light-colored clothes", status:"Washing", total:120, paid:120, method:"Cash", created:new Date(Date.now()-86400000*1).toISOString()},
  {id:"002", name:"Juan Dela Cruz", phone:"09981234567", type:"Comforter", weight:3, notes:"", status:"Drying", total:180, paid:100, method:"GCash", created:new Date(Date.now()-86400000*2).toISOString()},
  {id:"003", name:"Maria lee", phone:"09182345678", type:"Blanket", weight:2.5, notes:"", status:"Folding", total:150, paid:0, method:"Cash", created:new Date(Date.now()-86400000*2).toISOString()},
  {id:"004", name:"Reynaldo Reyes", phone:"09273456789", type:"Regular clothes", weight:6, notes:"", status:"Ready", total:144, paid:144, method:"Cash", created:new Date(Date.now()-86400000*3).toISOString()},
  {id:"005", name:"Carlo Santos", phone:"09993456789", type:"Mixed laundry", weight:4, notes:"Pickup by family member", status:"Ready", total:160, paid:0, method:"GCash", created:new Date(Date.now()-86400000*4).toISOString()}
];

function loadOrders(){
  try { const saved = localStorage.getItem(STORAGE_KEY); if(saved){const parsed=JSON.parse(saved);if(Array.isArray(parsed))return parsed;} } catch(e){}
  return seedOrders.map(o=>({...o}));
}
let orders = loadOrders();
function saveOrders(){ try{localStorage.setItem(STORAGE_KEY,JSON.stringify(orders));}catch(e){showToast("Could not save to this browser. Check browser storage settings.",true);} }
function money(value){return "₱"+Number(value||0).toLocaleString("en-PH",{minimumFractionDigits:2,maximumFractionDigits:2});}
function esc(value){return String(value??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));}
function dateText(value){return new Date(value).toLocaleDateString("en-PH",{year:"numeric",month:"short",day:"numeric"});}
function statusClass(status){return "status-"+String(status).toLowerCase().replace(/\s+/g,"-");}
function statusBadge(status){return `<span class="status-badge ${statusClass(status)}">${esc(status)}</span>`;}
function showToast(message,isError=false){const el=document.getElementById("toast");el.textContent=message;el.classList.toggle("error",isError);el.classList.add("show");clearTimeout(toastTimer);toastTimer=setTimeout(()=>el.classList.remove("show"),3200);}
function getOrder(id){return orders.find(o=>o.id===id);}
function nextOrderId(){let max=1000;orders.forEach(o=>{const n=Number(String(o.id).replace(/\D/g,""));if(n>max)max=n;});return "LL-"+(max+1);}
function isLoggedIn(){return sessionStorage.getItem("luzLaundryStaffLoggedIn")==="yes";}

function navigate(page){
  if(["dashboard","new-order","orders","payments","customers","order-detail"].includes(page)&&!isLoggedIn()){page="login";showToast("Please sign in to access staff pages.",true);}
  currentPage=page;
  document.querySelectorAll(".page").forEach(p=>p.classList.add("hidden"));
  const target=document.getElementById("page-"+page);
  if(target)target.classList.remove("hidden");
  document.getElementById("loginNav").classList.toggle("hidden",isLoggedIn());
  document.getElementById("logoutBtn").classList.toggle("hidden",!isLoggedIn());
  document.querySelectorAll(".side-link").forEach(b=>b.classList.toggle("active",b.dataset.page===page));
  if(page==="dashboard")renderDashboard();
  if(page==="orders")renderOrders();
  if(page==="payments")renderPayments();
  if(page==="customers")renderCustomers();
  if(page==="payments")populatePaymentOrders();
  window.scrollTo({top:0,behavior:"smooth"});
}
document.addEventListener("click",e=>{
  const btn=e.target.closest("[data-page]");
  if(btn){e.preventDefault();navigate(btn.dataset.page);}
});
document.getElementById("logoutBtn").addEventListener("click",()=>{sessionStorage.removeItem("luzLaundryStaffLoggedIn");navigate("home");showToast("You have been logged out.");});

document.getElementById("loginForm").addEventListener("submit",e=>{
  e.preventDefault();
  const username=document.getElementById("username").value.trim();
  const password=document.getElementById("password").value;
  if(username==="staff"&&password==="laundry123"){
    sessionStorage.setItem("luzLaundryStaffLoggedIn","yes");
    document.getElementById("loginError").classList.add("hidden");
    document.getElementById("loginForm").reset();
    navigate("dashboard");showToast("Signed in successfully. Welcome to Luz Laundry!");
  }else{document.getElementById("loginError").classList.remove("hidden");}
});

document.getElementById("orderForm").addEventListener("submit",e=>{
  e.preventDefault();
  const form=e.currentTarget;
  const name=document.getElementById("customerName").value.trim();
  const phone=document.getElementById("phone").value.trim();
  const type=document.getElementById("laundryType").value;
  const weight=Number(document.getElementById("weight").value);
  if(!name||!phone||!type||!Number.isFinite(weight)||weight<=0){showToast("Please complete all required fields correctly.",true);return;}
  const rate=type==="Comforter"?60:type==="Blanket"?60:30;
  const order={id:nextOrderId(),name,phone,type,weight,notes:document.getElementById("specialRequest").value.trim(),status:"Received",total:Math.round(weight*rate*100)/100,paid:0,method:"Not recorded",created:new Date().toISOString()};
  orders.unshift(order);saveOrders();form.reset();renderDashboard();navigate("orders");showToast(`Order ${order.id} was saved successfully.`);
});

function renderDashboard(){
  document.getElementById("statTotal").textContent=orders.length;
  document.getElementById("statReady").textContent=orders.filter(o=>o.status==="Ready").length;
  document.getElementById("statUnclaimed").textContent=orders.filter(o=>o.status==="Ready").length;
  document.getElementById("statIncome").textContent=money(orders.reduce((sum,o)=>sum+Number(o.paid||0),0));
  const tbody=document.getElementById("recentOrders");
  const recent=orders.slice(0,5);
  tbody.innerHTML=recent.length?recent.map(o=>`<tr><td><strong>${esc(o.id)}</strong></td><td>${esc(o.name)}</td><td>${esc(o.type)}</td><td>${statusBadge(o.status)}</td><td>${money(o.total)}</td><td><button class="table-action" data-view="${esc(o.id)}">View</button></td></tr>`).join(""):`<tr><td colspan="6"><div class="empty-state"><strong>No orders yet</strong>Create your first order to get started.</div></td></tr>`;
}
function renderOrders(){
  const search=(document.getElementById("orderSearch").value||"").toLowerCase().trim();
  const status=document.getElementById("statusFilter").value;
  const list=orders.filter(o=>(!search||o.id.toLowerCase().includes(search)||o.name.toLowerCase().includes(search))&&(!status||o.status===status));
  document.getElementById("ordersTable").innerHTML=list.length?list.map(o=>`<tr><td><strong>${esc(o.id)}</strong></td><td>${esc(o.name)}</td><td>${esc(o.type)}<br><span class="muted">${esc(o.weight)} kg</span></td><td>${statusBadge(o.status)}</td><td>${money(o.total)}</td><td><button class="table-action" data-view="${esc(o.id)}">View details</button></td></tr>`).join(""):`<tr><td colspan="6"><div class="empty-state"><strong>No matching orders</strong>Try a different search or status filter.</div></td></tr>`;
  document.getElementById("ordersCount").textContent=`Showing ${list.length} of ${orders.length} order(s).`;
}
document.getElementById("orderSearch").addEventListener("input",renderOrders);
document.getElementById("statusFilter").addEventListener("change",renderOrders);

document.addEventListener("click",e=>{
  const view=e.target.closest("[data-view]");
  if(view){renderOrderDetail(view.dataset.view);navigate("order-detail");}
  const update=e.target.closest("[data-update-status]");
  if(update){const o=getOrder(update.dataset.updateStatus);if(o){const next=STATUSES.indexOf(o.status);o.status=STATUSES[Math.min(next+1,STATUSES.length-1)];saveOrders();renderOrderDetail(o.id);showToast(`Status updated to ${o.status}.`);}}
  const setStatus=e.target.closest("[data-set-status]");
  if(setStatus){const o=getOrder(setStatus.dataset.id);if(o){o.status=document.getElementById("detailStatus").value;saveOrders();renderOrderDetail(o.id);showToast("Laundry status updated successfully.");}}
  const pay=e.target.closest("[data-pay-order]");
  if(pay){navigate("payments");document.getElementById("paymentOrder").value=pay.dataset.payOrder;updatePaymentOrderInfo();}
  const track=e.target.closest("[data-track-id]");
  if(track){navigate("tracking");document.getElementById("trackNumber").value=track.dataset.trackId;showTracking(track.dataset.trackId);}
  const claim=e.target.closest("[data-claim]");
  if(claim){const o=getOrder(claim.dataset.claim);if(o){o.status="Claimed";saveOrders();renderOrderDetail(o.id);showToast("Order marked as claimed.");}}
});

function renderOrderDetail(id){
  const o=getOrder(id);const root=document.getElementById("orderDetailContent");
  if(!o){root.innerHTML='<div class="empty-state"><strong>Order not found</strong>Return to the order list and select an order.</div>';return;}
  root.innerHTML=`<div class="panel-heading"><div><span class="eyebrow">ORDER ${esc(o.id)}</span><h2>${esc(o.name)}</h2><p class="muted">Created ${dateText(o.created)}</p></div>${statusBadge(o.status)}</div>
  <div class="detail-grid"><div class="detail-item"><small>Phone number</small><strong>${esc(o.phone)}</strong></div><div class="detail-item"><small>Laundry type</small><strong>${esc(o.type)}</strong></div><div class="detail-item"><small>Weight</small><strong>${esc(o.weight)} kg</strong></div><div class="detail-item"><small>Total amount</small><strong>${money(o.total)}</strong></div><div class="detail-item"><small>Amount paid</small><strong>${money(o.paid)}</strong></div><div class="detail-item"><small>Balance</small><strong>${money(Math.max(0,o.total-o.paid))}</strong></div></div>
  <p><strong>Special requests:</strong> ${o.notes?esc(o.notes):'<span class="muted">No special requests</span>'}</p>
  <div class="field"><label for="detailStatus">Update laundry status</label><select id="detailStatus">${STATUSES.map(s=>`<option ${s===o.status?"selected":""}>${s}</option>`).join("")}</select></div>
  <div class="detail-actions"><button class="button" data-set-status data-id="${esc(o.id)}">Save status</button><button class="button button-secondary" data-pay-order="${esc(o.id)}">Record payment</button><button class="button button-secondary" data-track-id="${esc(o.id)}">Customer tracking view</button>${o.status==="Ready"?`<button class="button button-secondary" data-claim="${esc(o.id)}">Mark as claimed</button>`:""}</div>`;
}

function populatePaymentOrders(){
  const select=document.getElementById("paymentOrder");const previous=select.value;
  select.innerHTML='<option value="">Choose an order</option>'+orders.map(o=>`<option value="${esc(o.id)}">${esc(o.id)} — ${esc(o.name)}</option>`).join("");
  if(orders.some(o=>o.id===previous))select.value=previous;
  updatePaymentOrderInfo();
}
document.getElementById("paymentOrder").addEventListener("change",updatePaymentOrderInfo);
function updatePaymentOrderInfo(){
  const o=getOrder(document.getElementById("paymentOrder").value);const box=document.getElementById("paymentOrderInfo");
  if(!o){box.classList.add("hidden");box.innerHTML="";return;}
  box.classList.remove("hidden");box.innerHTML=`<strong>${esc(o.name)}</strong><br>Total: ${money(o.total)} · Paid: ${money(o.paid)} · Balance: <strong>${money(Math.max(0,o.total-o.paid))}</strong>`;
  document.getElementById("paymentAmount").max=Math.max(0,o.total-o.paid)||o.total;
}
document.getElementById("paymentForm").addEventListener("submit",e=>{
  e.preventDefault();const o=getOrder(document.getElementById("paymentOrder").value);const amount=Number(document.getElementById("paymentAmount").value);const method=document.getElementById("paymentMethod").value;
  if(!o){showToast("Please choose an order.",true);return;}
  if(!Number.isFinite(amount)||amount<=0){showToast("Enter a payment amount greater than zero.",true);return;}
  if(amount>Math.max(0,o.total-o.paid)+0.001){showToast("Payment is greater than the remaining balance.",true);return;}
  o.paid=Math.round((o.paid+amount)*100)/100;o.method=method;
  if(o.paid>=o.total)o.paid=o.total;
  saveOrders();e.currentTarget.reset();populatePaymentOrders();renderPayments();renderDashboard();showToast("Payment recorded successfully.");
});
function renderPayments(){
  const rows=orders.filter(o=>Number(o.paid)>0);
  document.getElementById("paymentsTable").innerHTML=rows.length?rows.map(o=>`<tr><td><strong>${esc(o.id)}</strong></td><td>${esc(o.name)}</td><td>${esc(o.method)}</td><td>${money(o.paid)}</td><td>${dateText(o.created)}</td></tr>`).join(""):`<tr><td colspan="5"><div class="empty-state"><strong>No payments recorded</strong>Payments will appear here after they are saved.</div></td></tr>`;
}
function renderCustomers(){
  const search=(document.getElementById("customerSearch").value||"").toLowerCase().trim();
  const map=new Map();
  orders.forEach(o=>{const key=o.phone||o.name;if(!map.has(key))map.set(key,{name:o.name,phone:o.phone,count:0,latest:o});const c=map.get(key);c.count++;if(new Date(o.created)>new Date(c.latest.created))c.latest=o;});
  const customers=[...map.values()].filter(c=>c.name.toLowerCase().includes(search)||c.phone.toLowerCase().includes(search));
  document.getElementById("customersTable").innerHTML=customers.length?customers.map(c=>`<tr><td><strong>${esc(c.name)}</strong></td><td>${esc(c.phone)}</td><td>${c.count}</td><td>${esc(c.latest.id)} · ${dateText(c.latest.created)}</td><td><button class="table-action" data-view="${esc(c.latest.id)}">Latest order</button></td></tr>`).join(""):`<tr><td colspan="5"><div class="empty-state"><strong>No customers found</strong>Try another name or phone number.</div></td></tr>`;
}
document.getElementById("customerSearch").addEventListener("input",renderCustomers);

document.getElementById("trackingForm").addEventListener("submit",e=>{e.preventDefault();showTracking(document.getElementById("trackNumber").value.trim());});
function showTracking(id){
  const o=orders.find(item=>item.id.toLowerCase()===String(id).trim().toLowerCase());
  const error=document.getElementById("trackingError"),result=document.getElementById("trackingResult");
  if(!o){error.classList.remove("hidden");result.classList.add("hidden");result.innerHTML="";return;}
  error.classList.add("hidden");result.classList.remove("hidden");
  const stages=["Received","Washing","Drying","Folding","Ready"];
  const current=o.status==="Claimed"?4:Math.max(0,stages.indexOf(o.status));
  result.innerHTML=`<div class="tracking-result-card"><div class="tracking-result-head"><div><h2>${esc(o.id)} · ${esc(o.name)}</h2><p>${esc(o.type)} · ${esc(o.weight)} kg · Order date ${dateText(o.created)}</p></div>${statusBadge(o.status)}</div><div class="tracking-progress">${stages.map((s,i)=>`<div class="track-step ${i<current?"done":""} ${i===current?"current":""}"><div class="track-circle">${i<current?"✓":i+1}</div><strong>${s}</strong><small>${i<current?"Completed":i===current?"Current status":"Upcoming"}</small></div>`).join("")}</div><div class="info-box"><strong>Current status:</strong> ${esc(o.status)}${o.status==="Ready"?" — Your laundry is ready for pickup.":o.status==="Claimed"?" — This order has been claimed.": " — Please check again later for updates."}</div><div class="detail-grid"><div class="detail-item"><small>Total amount</small><strong>${money(o.total)}</strong></div><div class="detail-item"><small>Payment balance</small><strong>${money(Math.max(0,o.total-o.paid))}</strong></div></div></div>`;
}
document.getElementById("year").textContent=new Date().getFullYear();

// Initial render. Demo orders make it possible to explore the prototype immediately.
renderDashboard();
if(isLoggedIn())navigate("dashboard");
