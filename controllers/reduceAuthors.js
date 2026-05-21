function reduceAuthors(books){
        var authors = [];
        for (let i=0; i<books.length; i++){
            if (books[i].author_ids.length > 1){
                authors.push(books[i].author_ids[0].name + " и др.");
                books[i].author_ids.name = books[i].author_ids[0].name + " и др.";   
            }
            else{
                authors.push( books[i].author_ids[0].name);
                books[i].author_ids.name = books[i].author_ids[0].name;
            }
        }
        return books;
}

module.exports = {reduceAuthors};