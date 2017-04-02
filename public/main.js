var app;

function app() {
    this.users = null
};

app.prototype.initEvents = function () {
    var self = this;

    $(document.body).on('click', '#addUser', function () {
        self.addUser();
    });

    $(document.body).on('click', '#updateUser', function () {
        self.updateUser();
    });

    $(document.body).on('click', '#deleteUserBut', function () {
        self.deleteUser();
    });

    // $('#getbut').on('click', function() {
    //     self.getUsers();deleteUserBut
    // });

    $('#getUserByIdBut').on('click', function() {
        self.getUserById();
    });

};

/**
 * Create User form submit
 */
app.prototype.addUser = function() {
    var self = this;
    var data = {}
    var arr = $('#userform').serializeArray();
    arr.forEach(function(item, i) {
        data[item.name] = item.value;
    });
    if (!data.name) {
        alert('You must specify at least a name!');
        return false;
    }
    $.ajax({
        type: 'POST',
        url: '/insert',
        data: data,
        success: function(res, status, xhr){
            console.log('RESULT: ', res, status, xhr);
            alert('User added successfully!');
            $('#userform')[0].reset();
        },
        error: function(xhr, status, error){
            console.log('Error! ' + xhr.status + ' ' + error + ' ' + status);
        }
    });
};

/**
 * Update User form submit
 */
app.prototype.updateUser = function() {
    var self = this;
    var data = {}
    var arr = $('#updateUserForm').serializeArray();
    arr.forEach(function(item, i) {
        data[item.name] = item.value;
    });
    if (!data.name) {
        alert('You must specify at least a name!');
        return false;
    } else if (!data.id) {
        alert('ID is required!');
        return false;
    }
    $.ajax({
        type: 'POST',
        url: '/update',
        data: data,
        success: function(res, status, xhr){
            console.log('RESULT: ', res, status, xhr);
            alert('User added successfully!');
            $('#updateUserForm')[0].reset();
        },
        error: function(xhr, status, error){
            console.log('Error! ' + xhr.status + ' ' + error + ' ' + status);
        }
    });
};

/**
 * Delete User form submit
 */
app.prototype.deleteUser = function() {
    var id = $('#idUserToDelete').val();
    var self = this;
    if (!id) {
        alert('ID is required!');
        return false;
    }
    $.ajax({
        type: 'POST',
        url: '/delete',
        data: {id: id},
        success: function(res, status, xhr){
            console.log('RESULT: ', res, status, xhr);
            alert('User deleted successfully!');
            $('#deleteUserForm')[0].reset();
            self.getUsers();
        },
        error: function(xhr, status, error){
            console.log('Error! ' + xhr.status + ' ' + error + ' ' + status);
        }
    });
};

/**
 * Get all users
 */
app.prototype.getUsers = function() {
    var self = this;
    $.ajax({
        type: 'GET',
        url: '/get-all',
        success: function(res, status, xhr){
            console.log('RESULT: ', res);
            if (res.status == 200 && res.data && res.data.length) {
                self.renderTable(res.data);
            }
        },
        error: function(xhr, status, error){
            console.log('Error! ' + xhr.status + ' ' + error + ' ' + status);
        }
    });
};

/**
 * Render teable fucnction
 * @param {array} arr
 */
app.prototype.renderTable = function(arr) {
    var tbody = $('#result tbody');
    tbody.text('');
    $.each(arr, function(i, val) {
        tbody.append('<tr>' +
            '<th scope="row">' + (i + 1) + '</th>' +
            '<td>' + val.name + '</td>' +
            '<td>' + val.email + '</td>' +
            '<td>' + val.phone + '</td>' +
            '<td>' + val._id + '</td>' +
            '</tr>');
    });
};

app.prototype.init = function() {
    this.getUsers();
    this.initEvents();
};

(function() {
    var App = new app();
    App.init();
})();