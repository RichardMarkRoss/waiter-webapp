module.exports = function (waiterAppFactory) {
    async function gettingWaiterDays(req, res) {
        const username = req.params.username
        //const days = req.body.
        await waiterAppFactory.insertWaiter(username);
        const checklist = await waiterAppFactory.getAllWeekDays();
        res.render('home', {
        checklist,
        username
        });
    }
    
    async function owner (req, res) {

        res.render('owner', {
        });
    }
    async function logging(req, res) {
        res.render('log')
    }
    return {
        gettingWaiterDays,
        logging,
        owner
    };
};