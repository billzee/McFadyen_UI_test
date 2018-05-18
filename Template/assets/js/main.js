var people = [];
var table = document.getElementById('people');
var tbody = table.getElementsByTagName('tbody')[0];
var thead = table.getElementsByTagName('thead')[0];
var columns = 
[
    {name: 'Picture', prop:  'picture'},
    {name: 'Name', prop:  'name'},
    {name: 'Age', prop:  'age'},
    {name: 'Active', prop:  'isActive'},
    {name: 'Email', prop:  'email'},
    {name: 'Phone', prop:  'phone'},
    {name: 'Company', prop:  'company'},
    {name: 'Balance', prop:  'balance'}
];

var form_group = document.getElementsByClassName('form-group')[0];

columns.forEach(function(col){
    var th = document.createElement('th');
    th.innerText = col.name;
    thead.appendChild(th);
});

(function() {
    loadDataset('people', function(response) {
        people = JSON.parse(response);
        updateTable(people);
    });
})();

function searchPeople(e){
    if(e.value){
        if(e.value.length > 3){
            displayErrors(false);

            var regex = new RegExp(e.value);
            var filtered_people = [];

            people.forEach(function(person){
                if(regex.test(person.name)){
                    filtered_people.push(person);
                }
            });

            updateTable(filtered_people);
        } else{
            displayErrors(true);
        }
    } else{
        displayErrors(false);
        updateTable();
    }
}

function displayErrors(toggle){
    if(toggle){
        form_group.classList.add('has-error');
        form_group.querySelector('.help-block').classList.remove('hidden');
    } else{
        form_group.classList.remove('has-error');
        form_group.querySelector('.help-block').classList.add('hidden');
    }

}

function loadDataset(dataset, callback) {   
    var xobj = new XMLHttpRequest();
    xobj.overrideMimeType('application/json');

    xobj.open('GET', '../assets/dataset/' + dataset + '-collection.json', true);

    xobj.onreadystatechange = function () {
        if (xobj.readyState == 4 && xobj.status == '200')
            callback(xobj.responseText);
    };

    xobj.send(null);  
}

function updateTable(param_people){
    var rows = param_people || people;
    tbody.innerHTML = '';

    rows.forEach(function(col){
        var tr = document.createElement('tr');
        var people_in_order = [];

        for(var prop in col) {
            for(var i = 0; i < columns.length; i++){
                if(columns[i].prop == prop)
                    people_in_order[i] = col[prop];
            }
        }

        people_in_order.forEach(function(prop){
            var td = document.createElement('td');
            if(prop === true)
                td.innerText = 'Yes';
            else if(prop === false)
                td.innerText = 'No';
            else
                td.innerText = prop;

            tr.appendChild(td);
        });

        tbody.appendChild(tr);
    });
}