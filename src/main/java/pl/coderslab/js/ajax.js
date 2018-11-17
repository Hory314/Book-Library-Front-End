let fillInfo = function (element, data)
{
    element.text("");

    let ul = $("<ul>");
    ul.append($("<li>").text("ID: " + data["id"]))
        .append($("<li>").text("Tytuł: " + data["title"]))
        .append($("<li>").text("Autor: " + data["author"]))
        .append($("<li>").text("Wydawnictwo: " + data["publisher"]))
        .append($("<li>").text("Kategoria: " + data["type"]))
        .append($("<li>").text("ISBN: " + data["isbn"]));

    element.append(ul);
};

let fillContent = function (data)
{
    data.forEach(book =>
    {
        createRow(book);
    });
};

function getBookData()
{
    let bookInfoDiv = $(this).siblings("div.book-info");
    let divWithId = $(this).parent();
    let bookId = divWithId.attr("data-book-id"); // book id
    console.log(bookId); // log

    $.ajax({
        url: 'http://localhost:8282/books/' + bookId,
        type: 'GET'
    })
        .done(function (data)
        {
            bookInfoDiv.text(data);
            fillInfo(bookInfoDiv, data);
            bookInfoDiv.slideToggle(300);
        });

    $(this).on("click", false); // $(this)em jest H1 który został kliknięty. Dodaje mu pusty eventListener wiec nie bedzie juz dzialal
                                // , false = Cancel action and prevent the event bubbling up by returning false
    $(this).on("click", slideOnly); // i od razu daje mu event tylko ze sliderem
}

function slideOnly()
{
    $(this).siblings("div.book-info").slideToggle(300);
}

let detailsAction = function ()
{
    //rozwijanie detali ksiazki
    let mainContentDiv = $("div.content");
    mainContentDiv.on("click", "h1", getBookData);

    // dodanie do formularza
    let bookForm = $("form");
    bookForm.on("submit", function (event)
    {
        event.preventDefault();
        let ti = bookForm.find("input[name=title]").val();
        let i = bookForm.find("input[name=isbn]").val();
        let a = bookForm.find("input[name=author]").val();
        let p = bookForm.find("input[name=publisher]").val();
        let t = bookForm.find("input[name=type]").val();

        if (ti == '' || i == '' || a == '' || p == '' || t == '')
        {
            return false;
        }

        let dataToSend = {
            "title": bookForm.find("input[name=title]").val(),
            "isbn": bookForm.find("input[name=isbn]").val(),
            "author": bookForm.find("input[name=author]").val(),
            "publisher": bookForm.find("input[name=publisher]").val(),
            "type": bookForm.find("input[name=type]").val()
        };

        let data2Update = {
            "id": bookForm.find("input[name=id]").val(),
            "title": bookForm.find("input[name=title]").val(),
            "isbn": bookForm.find("input[name=isbn]").val(),
            "author": bookForm.find("input[name=author]").val(),
            "publisher": bookForm.find("input[name=publisher]").val(),
            "type": bookForm.find("input[name=type]").val()
        };


        //console.log(dataToSend);
// update
        $.ajax({
            url: (bookForm.find("input[name=id]").val() === "" ? 'http://localhost:8282/books/' : 'http://localhost:8282/books/' + bookForm.find("[name=id]").val()),
            type: (bookForm.find("input[name=id]").val() === "" ? 'POST' : 'PUT'),
            contentType: 'application/json', // trzeba ustawic bo inaczej (415)
            data: JSON.stringify(bookForm.find("input[name=id]").val() === "" ? dataToSend : data2Update),
            // albo data: $( "form" ).serialize() -  standard URL-encoded notation (param1=val1&param2=val2&...
            dataType: "json"
        }).done(function (book)
        {
            bookForm.find("input[name=id]").val() === "" ? createRow(book) : updateRow(data2Update);
            // bookForm.find("input[name=id]").val("");
            // bookForm.find("input[type=submit]").val("Dodaj"); // always
        }).always(function ()
        {
            bookForm.find("input[name=title]").val("");
            bookForm.find("input[name=author]").val("");
            bookForm.find("input[name=publisher]").val("");
            bookForm.find("input[name=type]").val("");
            bookForm.find("input[name=isbn]").val("");

            bookForm.find("input[name=id]").val("");
            // bookForm.find("input[type=submit]").val("Dodaj");
        })
    });

    // usuwanie
    mainContentDiv.on("click", "button.remove", removeBook);

    //edycja
    mainContentDiv.on("click", "button.edit", editBook);

};

function editBook()
{
    $("span.addedit").text("Edytuj książkę");
    let divWithId = $(this).parent();
    let bookId = divWithId.attr("data-book-id"); // book id

    let formEl = $("form");
    formEl.find("input[name=id]").val(bookId);

    $.ajax({
        url: 'http://localhost:8282/books/' + bookId,
        type: 'GET'
    })
        .done(function (data)
        {
            formEl.find("input[name=title]").val(data["title"]);
            formEl.find("input[name=author]").val(data["author"]);
            formEl.find("input[name=publisher]").val(data["publisher"]);
            formEl.find("input[name=type]").val(data["type"]);
            formEl.find("input[name=isbn]").val(data["isbn"]);
        });

    // formEl.find("input[type=submit]").val("Dodaj");
    // formEl.find("input[name=id]").val("");

}

function removeBook()
{
    let divWithId = $(this).parent();
    let bookId = divWithId.attr("data-book-id"); // book id

    $.ajax({
        url: 'http://localhost:8282/books/' + bookId,
        type: 'DELETE'
    }).done(function ()
    {
        divWithId.remove();
    })
}

function updateRow(book)
{
    $("span.addedit").text("Dodaj książkę");
    let mainContentDiv = $("div.content");
    let elToUpdate = mainContentDiv.find("div[data-book-id=\"" + book["id"] + "\"]");
    elToUpdate.find("h1").text(book["title"]);
    let bookContentEl = elToUpdate.find("div.book-info");
    if (bookContentEl.attr("style") === "") // jak puste to rozwiniete i trzeba updatowac
    {

        bookContentEl.find("ul").find("li:nth-of-type(2)").text("Tytuł: " + book["title"])
            .next("li").text("Autor: " + book["author"])
            .next("li").text("Wydawnictwo: " + book["publisher"])
            .next("li").text("Kategoria: " + book["type"])
            .next("li").text("ISBN: " + book["isbn"]);
    }
}


function createRow(book)
{
    let mainContentDiv = $("div.content");

    let bookDiv = $("<div>");
    bookDiv.attr("data-book-id", book["id"]);

    let h1 = $("<h1>");
    h1.text(book["title"]).css("display", "inline-block");
    bookDiv.append(h1);

    let editButton = $("<button>").text("Edytuj").addClass("edit");
    bookDiv.append(editButton);

    let removeButton = $("<button>").text("Usuń").addClass("remove");
    bookDiv.append(removeButton);

    let bookInfoDiv = $("<div>");
    bookInfoDiv.addClass("book-info").css("display", "none");
    bookDiv.append(bookInfoDiv);

    bookDiv.append($("<hr>"));

    mainContentDiv.append(bookDiv);
}

let initData = function ()
{
    $.ajax({
        url: 'http://localhost:8282/books/',
        type: 'GET'
    })
        .done(function (data)
        {
            fillContent(data);
        });
};

$(document).ready(function ()
{
    initData();
    //add action on click to h1
    detailsAction();
});
