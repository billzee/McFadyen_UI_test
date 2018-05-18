var people = [];
var people_filtered = [];

var paginate_btn = document.getElementById('paginate');

var form_group = document.getElementsByClassName('form-group')[0];
var help_block = form_group.querySelector('.help-block');

var table = document.getElementById('people');
var tbody = table.getElementsByTagName('tbody')[0];
var thead = table.getElementsByTagName('thead')[0];

var page_number = 0;
var page_size = 10;

var columns = 
[
    {name: 'Picture',   prop:  'picture'},
    {name: 'Name',      prop:  'name'},
    {name: 'Age',       prop:  'age'},
    {name: 'Active',    prop:  'isActive'},
    {name: 'Email',     prop:  'email'},
    {name: 'Phone',     prop:  'phone'},
    {name: 'Company',   prop:  'company'},
    {name: 'Balance',   prop:  'balance'}
];

(function() {
    columns.forEach(function(col){
        var th = document.createElement('th');
        th.innerText = col.name;
        thead.appendChild(th);
    });

    loadDataset('people', function(response) {
        people = JSON.parse(response);
        paginate(people);
    });
})();

function searchPeople(input){
    people_filtered = [];
    page_number = 0;

    if(input.value){
        if(input.value.length > 2){
            displayError(false);
            displayWarning(false);

            var regex = new RegExp(input.value.toUpperCase());

            people.forEach(function(person){
                if(regex.test(person.name.toUpperCase())){
                    people_filtered.push(person);
                }
            });

            if(people_filtered.length > 0){
                displayWarning(false);
                paginate();
            } else{
                displayWarning(true);
                
            }

        } else{
            displayError(true);
        }
    } else{
        displayWarning(false);
        displayError(false);
        paginate();
    }
}

function paginate(){
    if(page_number == 0) tbody.innerHTML = '';
    var total_registers = people_filtered.length > 0 ? people_filtered : people;
    rows = total_registers.slice(page_number * page_size, (page_number + 1) * page_size);

    rows.forEach(function(col){
        var tr = document.createElement('tr');
        var ordered_array = [];

        for(var prop in col) {
            for(var i = 0; i < columns.length; i++){
                if(columns[i].prop == prop)
                    ordered_array[i] = {key: prop, value: col[prop]};
            }
        }

        ordered_array.forEach(function(item){
            var td = document.createElement('td');

            switch(item.key) {
                case 'isActive':
                    if(item.value === true)
                        td.innerText = 'Yes';
                    else if(item.value === false)
                        td.innerText = 'No';
                    break;
                case 'picture':
                    td.innerHTML = '<img class="img-responsive" src="' + item.value +'">';
                    break;
                default:
                    td.innerText = item.value;
            } 

            tr.appendChild(td);
        });

        tbody.appendChild(tr);
    });

    page_number++;

    var table_rows_count = tbody.getElementsByTagName('tr').length;

    if(table_rows_count == total_registers.length)
        paginate_btn.classList.add('hidden');
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

function displayWarning(toggle){
    hideUI(toggle);
    if(toggle){
        form_group.classList.add('has-warning');
        help_block.innerText = 'We didn\'t find any person with that name!';    
    }else{
        form_group.classList.remove('has-warning');
    }
}

function displayError(toggle){
    hideUI(toggle);
    if(toggle){
        form_group.classList.add('has-error');
        help_block.innerText = 'Please inform 3 characters or more.';
    }else{
        form_group.classList.remove('has-error');
    }
}

function hideUI(toggle){
    if(toggle){
        help_block.classList.remove('hidden');
        table.classList.add('hidden');
        paginate_btn.classList.add('hidden');
    }else{
        help_block.classList.add('hidden');
        table.classList.remove('hidden');
        paginate_btn.classList.remove('hidden');
    }
}