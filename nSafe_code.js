let contact_array = JSON.parse(localStorage.getItem('users')) || [];
function User_Object(name, debit, id) {
    this.name = name;
    this.debit = debit;
    this.id = id;
}
function newMovement(obj, value){
    obj.debit += value;
}
function Paid(obj){
    obj.debit = 0;
}
function create_User(id) {
    let v;
    while(true) {
        let name = window.prompt('Inserire nome nuovo contatto','nome')
        if (typeof(name)==='string') {
            v = new User_Object(name,0,(contact_array.length>0)? contact_array[contact_array.length-1].id+1 : 0);
            contact_array.push(v);
            break
        }
    }
    save_localstorage(v);
    show_user(id, v);
}
function show_user(id, user) {
    let box = document.getElementById(id);

    const row = document.createElement('tr');
    row.innerHTML =`
        <td>${user.name}</td>
        <td>${user.debit}</td>
        <td>
            <select onchange="manageAction(${user.id} this.value)">
                <option value=''>Azioni...</option>
                <option value='movement'>Nuovo movimento (transazione)</option>
                <option value='paid'>Segna come saldato</option>
                <option value='delete'>Elimina contatto</option>
            </select>
        </td>   
        `;
    const select = row.querySelector('select');
    select.addEventListener('change', () => {
        manageAction(user.id, select.value);
        refresh_table(id)
    })
    box.appendChild(row);
}
function save_localstorage() {
    localStorage.setItem('users',JSON.stringify(contact_array));
}
function load_localstorage(id) {
    for(c of contact_array) {
        show_user(id,c);
    }
    console.log(contact_array);
} 
function clear_localStorage(){
    if (window.confirm('Sicuro di voler eliminare tutti i contatti?')){
        localStorage.clear();
        contact_array = [];
        location.reload();
    }
}
function manageAction(id_user, action){
    const user = contact_array.find(c => c.id === id_user);
    if (!user) return;
    if (action === 'movement') {
        const value = window.prompt('Inserire il debito. Positivo se devi del denaro, negativo se ti è dovuto :');
        const number = parseFloat(value);
        if (!isNaN(number)) {
            newMovement(user,number);

        }
    } else if (action === 'paid') {
        if (window.confirm(`Segnare ${user.name} come saldato? Azzererai il suo credito`)) {
            Paid(user);

        }
    } else if (action === 'delete') {
        if (window.confirm(`Sicuro di voler elinimare ${user.name} `)) {
            contact_array = contact_array.filter(c => c.id !== id_user);
        }
    }
    save_localstorage();
}
function refresh_table(id) {
    document.getElementById(id).innerHTML = ``;
    load_localstorage(id);
}