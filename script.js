let list_of_users = [];
let list_of_properties_workspaces = [];
if(localStorage.getItem("list_of_users"))
{
    list_of_users = JSON.parse(localStorage.getItem("list_of_users"));
}

if(localStorage.getItem("list_of_properties_workspaces"))
{
    list_of_properties_workspaces = JSON.parse(localStorage.getItem("list_of_properties_workspaces"));
}

current_location = window.location.href.split("/");
current_page = current_location[current_location.length - 1];
current_page = current_page.split("?")[0];
if(sessionStorage.getItem("isLoggedIn") === "true" && (current_page === "signup.html" || current_page === "login.html") )
{
    alert("Already Logged In!!");
    let gotopage= "";
    list_of_users.forEach(user => {
        if(user.user_email === sessionStorage.getItem("loggedInUsername"))
        {
            (user.user_ownership === "owner") ? gotopage = "owner.html" : gotopage = "index.html";
        }
    });
    window.location = gotopage;
    document.getElementById("username").innerHTML = sessionStorage.getItem("loggedInUsername");
}
else if(sessionStorage.getItem("isLoggedIn") != "true" && current_page === "index.html")
{
    window.location = "login.html";
}

if(sessionStorage.getItem("isLoggedIn") === "true" && (current_page == "index.html" || current_page ==="owner.html" || current_page === "owner_add_property_workspace.html" || current_page === "owner_update_property_workspace.html" || current_page === "viewpost.html"))
{
    document.getElementById("signout").style.display = "block";
    let loggedInUserEmail = sessionStorage.getItem("loggedInUsername");
    list_of_users.forEach(user => {
        if(user.user_email === loggedInUserEmail)
        {
            document.getElementById("username").innerHTML = "Welcome "+user.user_name;
            document.getElementById("loginSignupMenu").style.display = "none";
            return;
        }
    });
}
else
{
    document.getElementById("loginSignupMenu").style.display = "inline";
    document.getElementById("signout").style.display = "none";
}

function showProperties()
{
    let table_data = "";

    if(list_of_properties_workspaces.length>0)
    {
        table_data += "<tr> <th>Title</th> <th>Description</th> <th>Type</th> <th>Edit/Delete</th> </tr>";
        let temp_len = 0;
        list_of_properties_workspaces.forEach(row => {
            if(row.post_user_email === sessionStorage.getItem("loggedInUsername"))
            {
                temp_len++;
                table_data+= "<tr> <td>"+row.post_title+"</td> <td>"+row.post_description+"</td><td>"+row.post_type+"</td> <td> <a href=\"owner_update_property_workspace.html?email="+row.post_user_email+"&title="+row.post_title+"\">Update</a> /<a href=\"owner_delete_property_workspace.html?email="+row.post_user_email+"&title="+row.post_title+"\">Delete</a> </td></tr>";
            }
        });

        if(temp_len<=0)
        {
            table_data = '<tr> <td style="font-size:30px"> No Properties/Workspaces Added for Current User </td> </tr>';    
        }
    }
    else
    {
        table_data = '<tr> <td style="font-size:30px"> No Properties/Workspaces Added </td> </tr>';
    }

    document.getElementById("list_of_properties_workspaces").innerHTML = table_data;    
}

function addProperty()
{
    let title_field = document.getElementById("title");
    let description_field = document.getElementById("description");
    let type_field = document.getElementById("type");

    let title = title_field.value;
    let description = description_field.value;
    let type = type_field.value;

    if(title.length>0 && description.length>0 && type.length>0)
    {
        let existed_title = false;
        list_of_properties_workspaces.forEach(row=>{
            if(/*row.post_user_email === sessionStorage.getItem("loggedInUsername") && */ row.post_title === title)
            {
                existed_title = true;
                return;
            }
        });

        if(existed_title)
        {
            alert("Post existed with similar title");
            title_field.value= "";
            title_field.focus();
        }
        else
        {
            list_of_properties_workspaces.push({
                post_user_email: sessionStorage.getItem("loggedInUsername"),
                post_title: title,
                post_description: description,
                post_type : type,
            });
    
            localStorage.setItem("list_of_properties_workspaces", JSON.stringify(list_of_properties_workspaces));
    
            alert("Successfully Added");
            window.location = "owner.html";
        }
    }
    else
    {
        alert("All Fields Required");
        title_field.focus();
    }

}

function updatePropertyOnLoad()
{
    let queryString = new URLSearchParams(window.location.search);
    let user_email = queryString.get("email");
    let post_title = queryString.get("title");
    
    let title,description,type;

    list_of_properties_workspaces.forEach(value => {
        if(value.post_user_email === user_email && value.post_title===post_title)
        {
            title = value.post_title;
            description = value.post_description;
            type = value.post_type;
        }
    });

    let selected_index = 0;
    document.getElementById("title").value = title;
    document.getElementById("description").value = description;
    (type == "property") ? selected_index = 1 : selected_index =2;
    document.getElementById("type").selectedIndex = selected_index;
}

function updateProperty()
{
    let title_field = document.getElementById("title");
    let description_field = document.getElementById("description");
    let type_field = document.getElementById("type");

    let title = title_field.value;
    let description = description_field.value;
    let type = type_field.value;

    
    let queryString = new URLSearchParams(window.location.search);
    let user_email = queryString.get("email");
    let post_title = queryString.get("title");

    if(title.length>0 && description.length>0 && type.length>0)
    {
        let existed_title = false;
        let sample_list = list_of_properties_workspaces.filter(function(value){
            if(!(value.post_user_email === user_email && value.post_title=== post_title))
            {
                return value;
            }
        });

        sample_list.forEach(row=>{
            if(row.post_user_email === sessionStorage.getItem("loggedInUsername") && row.post_title === title)
            {
                existed_title = true;
                return;
            }
        });

        if(existed_title)
        {
            alert("Post existed with similar title");
            title_field.focus();
        }
        else
        {            
            list_of_properties_workspaces.forEach(value => {
                if(value.post_user_email === user_email && value.post_title === post_title)
                {;
                    value.post_title= title;
                    value.post_description= description;
                    value.post_type = type;
                }
            });
        
            localStorage.setItem("list_of_properties_workspaces", JSON.stringify(list_of_properties_workspaces));

            alert("Successfully Updated");
            window.location = "owner.html";
        }
    }
    else
    {
        alert("All Fields Required");
        title_field.focus();
    }
}


function signOut()
{
    if(sessionStorage.getItem("isLoggedIn") === "true" && sessionStorage.getItem("loggedInUsername").length > 0)
    {
        sessionStorage.removeItem("isLoggedIn");
        sessionStorage.removeItem("loggedInUsername");
        window.location = "index.html";
        alert("Successfully Logged Out!");
    }
}

function createUser()
{
    let name_field = document.getElementById("name");
    let email_field = document.getElementById("email");
    let phone_field = document.getElementById("phone");
    let password_field = document.getElementById("password");
    let confirm_password_field = document.getElementById("confirm_password");
    let ownership_field = document.getElementById("ownership");

    let name = name_field.value;
    let email = email_field.value;
    let phone = phone_field.value;
    let password = password_field.value;
    let confirm_password = confirm_password_field.value;
    let ownership = ownership_field.value;

    if(name.length === 0 || email.length === 0 || password.length === 0 || confirm_password.length === 0 || ownership.length === 0) 
    {
        alert("Please Fill the required fields");
    }
    else
    {
        if(password === confirm_password)
        {
            //check for existing user
            let existed_user = false;
            list_of_users.forEach(row=>{
                if(row.user_email === email)
                {
                    existed_user = true;
                    return;
                }
            });

            // save user details to local storage.
            if(existed_user)
            {
                alert("Already Existed\nPlease Login!");
            }
            else
            {
                current_user = {
                    user_name : name,
                    user_email : email,
                    user_phone : phone,
                    user_password : encryptPassword(password),
                    user_ownership: ownership
                };
                list_of_users.push(current_user);
                localStorage.setItem("list_of_users",JSON.stringify(list_of_users));
                alert("Successfully Signed Up!");
            }
            window.location = "login.html";
        }
        else
        {
            alert("Confirm Password different from password\nPLease Try Again!");
            //window.location.reload();
            password_field.value = null;
            password_field.focus();
            confirm_password_field.value = null;
        }
    }     
}

function loginUser()
{
    let correct_credentials = false;
    let ownership_type ="";
    let email = document.getElementById("email").value;
    let password = document.getElementById("password").value;
    list_of_users.forEach(user => {
        if(user.user_email === email && user.user_password === encryptPassword(password))
        {
            sessionStorage.setItem("isLoggedIn","true");
            sessionStorage.setItem("loggedInUsername",email);
            ownership_type = user.user_ownership;
            correct_credentials = true;
            return;
        }
    });

    if(correct_credentials===true && ownership_type==="coworker")
    {
        window.location = "index.html";
    }
    else if(correct_credentials===true && ownership_type==="owner")
    {
        window.location = "owner.html";
    }
    else
    {
        alert("Invalid Credentials\nPlease Try Again!");
        document.getElementById("email").value = null;
        document.getElementById("password").value = null;
        document.getElementById("email").focus();
    }

}

function propertiesTable()
{
    let table_data = "";

    if(list_of_properties_workspaces.length>0)
    {
        table_data += "<tr> <th>Title</th> <th>Description</th> <th>Type</th> <th>View Post</th> </tr>";
        list_of_properties_workspaces.forEach(row => {
            table_data+= "<tr> <td>"+row.post_title+"</td> <td>"+row.post_description+"</td><td>"+row.post_type+"</td> <td> <a href=\"viewpost.html?title="+row.post_title+"\">View Post</a> </td></tr>";
        });
    }
    else
    {
        table_data = '<tr> <td style="font-size:30px"> No Properties/Workspaces Added </td> </tr>';
    }

    document.getElementById("propertiesTable").innerHTML = table_data;  
    
}

function viewPost()
{
    let queryString = new URLSearchParams(window.location.search);
    let post_title = queryString.get("title");
    
    let list_of_properties_workspaces = JSON.parse(localStorage.getItem("list_of_properties_workspaces"));

    list_of_properties_workspaces.forEach(function(value){
            if(value.post_title===post_title)
            {
                document.getElementById("postTitle").innerHTML = "Title: "+ value.post_title;
                document.getElementById("postDescription").innerHTML = "Description: " +value.post_description;
                document.getElementById("postType").innerHTML = "Type: "+value.post_type;
                document.getElementById("postEmail").innerHTML = "Contact: <a href=\"mailto:"+value.post_user_email+"\">"+value.post_user_email+"</a> for more info.";
                return;
            }
    });

}

function encryptPassword(password)
{
    let salt = "$#125Hhwerfsd#67"
    let encryptedPassword = sha512(salt+password+salt);
    return encryptedPassword;
}


// function sha512 copied from https://coursesweb.net/javascript/sha512-encrypt-hash_cs
/*
* Secure Hash Algorithm (SHA512)
* http://www.happycode.info/
* function sha512 copied from https://coursesweb.net/javascript/sha512-encrypt-hash_cs
*/

function sha512(str) 
{
    function int64(msint_32, lsint_32) {
    this.highOrder = msint_32;
    this.lowOrder = lsint_32;
    }
   
    var H = [new int64(0x6a09e667, 0xf3bcc908), new int64(0xbb67ae85, 0x84caa73b),
    new int64(0x3c6ef372, 0xfe94f82b), new int64(0xa54ff53a, 0x5f1d36f1),
    new int64(0x510e527f, 0xade682d1), new int64(0x9b05688c, 0x2b3e6c1f),
    new int64(0x1f83d9ab, 0xfb41bd6b), new int64(0x5be0cd19, 0x137e2179)];
   
    var K = [new int64(0x428a2f98, 0xd728ae22), new int64(0x71374491, 0x23ef65cd),
    new int64(0xb5c0fbcf, 0xec4d3b2f), new int64(0xe9b5dba5, 0x8189dbbc),
    new int64(0x3956c25b, 0xf348b538), new int64(0x59f111f1, 0xb605d019),
    new int64(0x923f82a4, 0xaf194f9b), new int64(0xab1c5ed5, 0xda6d8118),
    new int64(0xd807aa98, 0xa3030242), new int64(0x12835b01, 0x45706fbe),
    new int64(0x243185be, 0x4ee4b28c), new int64(0x550c7dc3, 0xd5ffb4e2),
    new int64(0x72be5d74, 0xf27b896f), new int64(0x80deb1fe, 0x3b1696b1),
    new int64(0x9bdc06a7, 0x25c71235), new int64(0xc19bf174, 0xcf692694),
    new int64(0xe49b69c1, 0x9ef14ad2), new int64(0xefbe4786, 0x384f25e3),
    new int64(0x0fc19dc6, 0x8b8cd5b5), new int64(0x240ca1cc, 0x77ac9c65),
    new int64(0x2de92c6f, 0x592b0275), new int64(0x4a7484aa, 0x6ea6e483),
    new int64(0x5cb0a9dc, 0xbd41fbd4), new int64(0x76f988da, 0x831153b5),
    new int64(0x983e5152, 0xee66dfab), new int64(0xa831c66d, 0x2db43210),
    new int64(0xb00327c8, 0x98fb213f), new int64(0xbf597fc7, 0xbeef0ee4),
    new int64(0xc6e00bf3, 0x3da88fc2), new int64(0xd5a79147, 0x930aa725),
    new int64(0x06ca6351, 0xe003826f), new int64(0x14292967, 0x0a0e6e70),
    new int64(0x27b70a85, 0x46d22ffc), new int64(0x2e1b2138, 0x5c26c926),
    new int64(0x4d2c6dfc, 0x5ac42aed), new int64(0x53380d13, 0x9d95b3df),
    new int64(0x650a7354, 0x8baf63de), new int64(0x766a0abb, 0x3c77b2a8),
    new int64(0x81c2c92e, 0x47edaee6), new int64(0x92722c85, 0x1482353b),
    new int64(0xa2bfe8a1, 0x4cf10364), new int64(0xa81a664b, 0xbc423001),
    new int64(0xc24b8b70, 0xd0f89791), new int64(0xc76c51a3, 0x0654be30),
    new int64(0xd192e819, 0xd6ef5218), new int64(0xd6990624, 0x5565a910),
    new int64(0xf40e3585, 0x5771202a), new int64(0x106aa070, 0x32bbd1b8),
    new int64(0x19a4c116, 0xb8d2d0c8), new int64(0x1e376c08, 0x5141ab53),
    new int64(0x2748774c, 0xdf8eeb99), new int64(0x34b0bcb5, 0xe19b48a8),
    new int64(0x391c0cb3, 0xc5c95a63), new int64(0x4ed8aa4a, 0xe3418acb),
    new int64(0x5b9cca4f, 0x7763e373), new int64(0x682e6ff3, 0xd6b2b8a3),
    new int64(0x748f82ee, 0x5defb2fc), new int64(0x78a5636f, 0x43172f60),
    new int64(0x84c87814, 0xa1f0ab72), new int64(0x8cc70208, 0x1a6439ec),
    new int64(0x90befffa, 0x23631e28), new int64(0xa4506ceb, 0xde82bde9),
    new int64(0xbef9a3f7, 0xb2c67915), new int64(0xc67178f2, 0xe372532b),
    new int64(0xca273ece, 0xea26619c), new int64(0xd186b8c7, 0x21c0c207),
    new int64(0xeada7dd6, 0xcde0eb1e), new int64(0xf57d4f7f, 0xee6ed178),
    new int64(0x06f067aa, 0x72176fba), new int64(0x0a637dc5, 0xa2c898a6),
    new int64(0x113f9804, 0xbef90dae), new int64(0x1b710b35, 0x131c471b),
    new int64(0x28db77f5, 0x23047d84), new int64(0x32caab7b, 0x40c72493),
    new int64(0x3c9ebe0a, 0x15c9bebc), new int64(0x431d67c4, 0x9c100d4c),
    new int64(0x4cc5d4be, 0xcb3e42b6), new int64(0x597f299c, 0xfc657e2a),
    new int64(0x5fcb6fab, 0x3ad6faec), new int64(0x6c44198c, 0x4a475817)];
   
    var W = new Array(64);
    var a, b, c, d, e, f, g, h, i, j;
    var T1, T2;
    var charsize = 8;
   
    function utf8_encode(str) {
    return unescape(encodeURIComponent(str));
    }
   
    function str2binb(str) {
    var bin = [];
    var mask = (1 << charsize) - 1;
    var len = str.length * charsize;
   
    for (var i = 0; i < len; i += charsize) {
    bin[i >> 5] |= (str.charCodeAt(i / charsize) & mask) << (32 - charsize - (i % 32));
    }
   
    return bin;
    }
   
    function binb2hex(binarray) {
    var hex_tab = '0123456789abcdef';
    var str = '';
    var length = binarray.length * 4;
    var srcByte;
   
    for (var i = 0; i < length; i += 1) {
    srcByte = binarray[i >> 2] >> ((3 - (i % 4)) * 8);
    str += hex_tab.charAt((srcByte >> 4) & 0xF) + hex_tab.charAt(srcByte & 0xF);
    }
   
    return str;
    }
   
    function safe_add_2(x, y) {
    var lsw, msw, lowOrder, highOrder;
   
    lsw = (x.lowOrder & 0xFFFF) + (y.lowOrder & 0xFFFF);
    msw = (x.lowOrder >>> 16) + (y.lowOrder >>> 16) + (lsw >>> 16);
    lowOrder = ((msw & 0xFFFF) << 16) | (lsw & 0xFFFF);
   
    lsw = (x.highOrder & 0xFFFF) + (y.highOrder & 0xFFFF) + (msw >>> 16);
    msw = (x.highOrder >>> 16) + (y.highOrder >>> 16) + (lsw >>> 16);
    highOrder = ((msw & 0xFFFF) << 16) | (lsw & 0xFFFF);
   
    return new int64(highOrder, lowOrder);
    }
   
    function safe_add_4(a, b, c, d) {
    var lsw, msw, lowOrder, highOrder;
   
    lsw = (a.lowOrder & 0xFFFF) + (b.lowOrder & 0xFFFF) + (c.lowOrder & 0xFFFF) + (d.lowOrder & 0xFFFF);
    msw = (a.lowOrder >>> 16) + (b.lowOrder >>> 16) + (c.lowOrder >>> 16) + (d.lowOrder >>> 16) + (lsw >>> 16);
    lowOrder = ((msw & 0xFFFF) << 16) | (lsw & 0xFFFF);
   
    lsw = (a.highOrder & 0xFFFF) + (b.highOrder & 0xFFFF) + (c.highOrder & 0xFFFF) + (d.highOrder & 0xFFFF) + (msw >>> 16);
    msw = (a.highOrder >>> 16) + (b.highOrder >>> 16) + (c.highOrder >>> 16) + (d.highOrder >>> 16) + (lsw >>> 16);
    highOrder = ((msw & 0xFFFF) << 16) | (lsw & 0xFFFF);
   
    return new int64(highOrder, lowOrder);
    }
   
    function safe_add_5(a, b, c, d, e) {
    var lsw, msw, lowOrder, highOrder;
   
    lsw = (a.lowOrder & 0xFFFF) + (b.lowOrder & 0xFFFF) + (c.lowOrder & 0xFFFF) + (d.lowOrder & 0xFFFF) + (e.lowOrder & 0xFFFF);
    msw = (a.lowOrder >>> 16) + (b.lowOrder >>> 16) + (c.lowOrder >>> 16) + (d.lowOrder >>> 16) + (e.lowOrder >>> 16) + (lsw >>> 16);
    lowOrder = ((msw & 0xFFFF) << 16) | (lsw & 0xFFFF);
   
    lsw = (a.highOrder & 0xFFFF) + (b.highOrder & 0xFFFF) + (c.highOrder & 0xFFFF) + (d.highOrder & 0xFFFF) + (e.highOrder & 0xFFFF) + (msw >>> 16);
    msw = (a.highOrder >>> 16) + (b.highOrder >>> 16) + (c.highOrder >>> 16) + (d.highOrder >>> 16) + (e.highOrder >>> 16) + (lsw >>> 16);
    highOrder = ((msw & 0xFFFF) << 16) | (lsw & 0xFFFF);
   
    return new int64(highOrder, lowOrder);
    }
   
    function maj(x, y, z) {
    return new int64(
    (x.highOrder & y.highOrder) ^ (x.highOrder & z.highOrder) ^ (y.highOrder & z.highOrder),
    (x.lowOrder & y.lowOrder) ^ (x.lowOrder & z.lowOrder) ^ (y.lowOrder & z.lowOrder)
    );
    }
   
    function ch(x, y, z) {
    return new int64(
    (x.highOrder & y.highOrder) ^ (~x.highOrder & z.highOrder),
    (x.lowOrder & y.lowOrder) ^ (~x.lowOrder & z.lowOrder)
    );
    }
   
    function rotr(x, n) {
    if (n <= 32) {
    return new int64(
    (x.highOrder >>> n) | (x.lowOrder << (32 - n)),
    (x.lowOrder >>> n) | (x.highOrder << (32 - n))
    );
    } else {
    return new int64(
    (x.lowOrder >>> n) | (x.highOrder << (32 - n)),
    (x.highOrder >>> n) | (x.lowOrder << (32 - n))
    );
    }
    }
   
    function sigma0(x) {
    var rotr28 = rotr(x, 28);
    var rotr34 = rotr(x, 34);
    var rotr39 = rotr(x, 39);
   
    return new int64(
    rotr28.highOrder ^ rotr34.highOrder ^ rotr39.highOrder,
    rotr28.lowOrder ^ rotr34.lowOrder ^ rotr39.lowOrder
    );
    }
   
    function sigma1(x) {
    var rotr14 = rotr(x, 14);
    var rotr18 = rotr(x, 18);
    var rotr41 = rotr(x, 41);
   
    return new int64(
    rotr14.highOrder ^ rotr18.highOrder ^ rotr41.highOrder,
    rotr14.lowOrder ^ rotr18.lowOrder ^ rotr41.lowOrder
    );
    }
   
    function gamma0(x) {
    var rotr1 = rotr(x, 1), rotr8 = rotr(x, 8), shr7 = shr(x, 7);
   
    return new int64(
    rotr1.highOrder ^ rotr8.highOrder ^ shr7.highOrder,
    rotr1.lowOrder ^ rotr8.lowOrder ^ shr7.lowOrder
    );
    }
   
    function gamma1(x) {
    var rotr19 = rotr(x, 19);
    var rotr61 = rotr(x, 61);
    var shr6 = shr(x, 6);
   
    return new int64(
    rotr19.highOrder ^ rotr61.highOrder ^ shr6.highOrder,
    rotr19.lowOrder ^ rotr61.lowOrder ^ shr6.lowOrder
    );
    }
   
    function shr(x, n) {
    if (n <= 32) {
    return new int64(
    x.highOrder >>> n,
    x.lowOrder >>> n | (x.highOrder << (32 - n))
    );
    } else {
    return new int64(
    0,
    x.highOrder << (32 - n)
    );
    }
    }
   
    str = utf8_encode(str);
    strlen = str.length*charsize;
    str = str2binb(str);
   
    str[strlen >> 5] |= 0x80 << (24 - strlen % 32);
    str[(((strlen + 128) >> 10) << 5) + 31] = strlen;
   
    for (var i = 0; i < str.length; i += 32) {
    a = H[0];
    b = H[1];
    c = H[2];
    d = H[3];
    e = H[4];
    f = H[5];
    g = H[6];
    h = H[7];
   
    for (var j = 0; j < 80; j++) {
    if (j < 16) {
    W[j] = new int64(str[j*2 + i], str[j*2 + i + 1]);
    } else {
    W[j] = safe_add_4(gamma1(W[j - 2]), W[j - 7], gamma0(W[j - 15]), W[j - 16]);
    }
   
    T1 = safe_add_5(h, sigma1(e), ch(e, f, g), K[j], W[j]);
    T2 = safe_add_2(sigma0(a), maj(a, b, c));
    h = g;
    g = f;
    f = e;
    e = safe_add_2(d, T1);
    d = c;
    c = b;
    b = a;
    a = safe_add_2(T1, T2);
    }
   
    H[0] = safe_add_2(a, H[0]);
    H[1] = safe_add_2(b, H[1]);
    H[2] = safe_add_2(c, H[2]);
    H[3] = safe_add_2(d, H[3]);
    H[4] = safe_add_2(e, H[4]);
    H[5] = safe_add_2(f, H[5]);
    H[6] = safe_add_2(g, H[6]);
    H[7] = safe_add_2(h, H[7]);
    }
   
    var binarray = [];
    for (var i = 0; i < H.length; i++) {
    binarray.push(H[i].highOrder);
    binarray.push(H[i].lowOrder);
    }
    return binb2hex(binarray);
}