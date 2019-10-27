d3.json('data/words.json').then(data => {

    //console.log(data);
    let table = new Table(data);
    let bubble = new Bubble(data,table);

    bubble.createBubble();
    table.createTable();
    table.updateTable();

});