module.exports = function (waiterAppFactory) {
    async function home (req, res) {
        const username = req.params.username;
        const checklist = await waiterAppFactory.getAllWeekDays(username);
        const match = await waiterAppFactory.matchCheckDays(username);
        res.render('home', {
            checklist,
            username,
            match
        });
    }
    async function gettingWaiterDays (req, res) {
        const username = req.params.username;
        // console.log(username);
        const daysID = req.body.day_id;
        // console.log(daysID);
        await waiterAppFactory.insertWaiter(username);
        await waiterAppFactory.daysPassed(daysID, username);
        // const checklist = await waiterAppFactory.getAllWeekDays(username);
        const checklist = await waiterAppFactory.matchCheckDays(username);
        // console.log(match);
        res.render('home', {
            checklist,
            username
            // ,
            // match
        });
    }

    async function owner (req, res) {
        // let waiter = await waiterAppFactory.getAllWaiters();
        let shifts = await waiterAppFactory.displayShifts();

        await waiterAppFactory.displayShifts;
        res.render('owner', {
            shifts
        });
    }

    async function clearDataBaseWaiter (req, res) {
        await waiterAppFactory.clearDayValues();
        res.redirect('shifts');
    }

    function login (req, res) {
        const owner = req.body.ownerId;
        const waiter = req.body.waiterId;
        if (owner !== '') {
            return res.redirect('./shifts');
        };
        if (waiter !== '') {
            return res.redirect('/waiter/' + waiter);
        };
        if (waiter === '' && owner === '') {
            req.flash('error', 'please insert a waiter name or owner sign in');
            res.render('log');
        }
    }

    function index (req, res) {
        res.render('log');
    }

    return {
        gettingWaiterDays,
        login,
        owner,
        clearDataBaseWaiter,
        home,
        index
    };
};
