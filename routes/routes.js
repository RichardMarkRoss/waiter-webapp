module.exports = function (waiterAppFactory) {
    async function home (req, res) {
        const username = req.params.username;
        const checklist = await waiterAppFactory.getAllWeekDays();
        res.render('home', {
            checklist,
            username
        });
    }
    async function gettingWaiterDays (req, res) {
        const username = req.params.username;
        const daysID = req.body.day_id;
        // console.log(daysID);
        await waiterAppFactory.insertWaiter(username);
        await waiterAppFactory.daysPassed(daysID, username);
        const checklist = await waiterAppFactory.getAllWeekDays();
        res.render('home', {
            checklist,
            username
        });
    }
    async function owner (req, res) {
        res.render('owner', {});
    }
    async function clearDataBaseWaiter (req, res) {
        await waiterAppFactory.clearDayValues();
        res.render('owner', {});
    }
    async function logging (req, res) {
        res.render('log');
    }
    return {
        gettingWaiterDays,
        logging,
        owner,
        clearDataBaseWaiter,
        home
    };
};
