module.exports = {
    async index(request, response) {
        return response.render('Home/index', { title: "Snake Game" });
    },


    async gamePartial(request, response) {
        return response.render('Home/gamePartial');
    },


  

}