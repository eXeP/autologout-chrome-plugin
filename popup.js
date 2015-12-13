function isInt(value) {
  return !isNaN(value) && 
         parseInt(Number(value)) == value && 
         !isNaN(parseInt(value, 10));
}

// Restores select box and checkbox state using the preferences
// stored in chrome.storage.
function restore_options() {
  // Use default value color = 'red' and likesColor = true.
  document.getElementById('saveBtn').addEventListener("click", save_options);
  document.getElementById('idle1').onchange = save_options;
  document.getElementById('idle2').onchange = save_options;
  chrome.storage.sync.get({
    idletime1: 20,
    idletime2: 20
  }, function(items) {
    document.getElementById('idle1').value = items.idletime1;
    document.getElementById('idle2').value = items.idletime2;
  });
}

function save_options() {
  
  var idle_1 = document.getElementById('idle1').value;
  var idle_2 = document.getElementById('idle2').value;
  if(!isInt(idle_1) || !isInt(idle_2) || idle_1 <= 0 || idle_2 <= 0){
    var status = document.getElementById('status');
    status.textContent = 'Ajat eivät kelpaa.';
    setTimeout(function() {
      status.textContent = '';
    }, 1000);

  }
  else{
    chrome.storage.sync.set({
    idletime1: idle_1,
    idletime2: idle_2
     }, function() {
     // Update status to let user know options were saved.
      var status = document.getElementById('status');
      status.textContent = 'Tallennettu';
      setTimeout(function() {
        status.textContent = '';
      }, 1000);
    });
  }
  
}

document.addEventListener('DOMContentLoaded', restore_options);

