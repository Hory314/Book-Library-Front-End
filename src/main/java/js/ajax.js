let status = function (statusText)
{
    let statusEl = $("#status");
    statusEl.text(statusText);
};

let fillInfo = function (element, data)
{
    element.text(data["id"] + " " + data["isbn"]);//todo reszta danych
};


let fillContent = function (data)
{
    data.forEach(book =>
    {
        let mainContentDiv = $("div.content");

        let bookDiv = $("<div>");
        bookDiv.attr("data-book-id", book["id"]);

        let h1 = $("<h1>");
        h1.text(book["title"]);
        bookDiv.append(h1);

        let bookInfoDiv = $("<div>");
        bookInfoDiv.addClass("book-info").css("display", "none");
        bookDiv.append(bookInfoDiv);

        mainContentDiv.append(bookDiv);
    });
};

function getBookData (event)
{
    let bookInfoDiv = $(this).next("div.book-info");
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
            status("Pobrano metodą " + this.type + " z " + this.url);
            bookInfoDiv.slideToggle(300);
        });

    event.stopImmediatePropagation(); // nie wywoluj zwyklego likniecia ze slideToggle
    $(this).off("click","h1");
}

let detailsAction = function ()
{
    let mainContentDiv = $("div.content");
    console.log(mainContentDiv);

    mainContentDiv.on("click", "h1", getBookData); //

    mainContentDiv.on("click", "h1", function (event)
    {
        let bookInfoDiv = $(this).next("div.book-info");
        bookInfoDiv.slideToggle(300);
    });


};


let initData = function ()
{
    $.ajax({
        url: 'http://localhost:8282/books/',
        type: 'GET'
    })
        .done(function (data)
        {
            fillContent(data);
            status("Pobrano metodą " + this.type + " z " + this.url);
        });

};

$(document).ready(function ()
{

    initData();
    //add action on click to h1
    detailsAction();

});
