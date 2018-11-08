module.exports = function (waiterAppFactory) {
    async function home (req, res) {
        const username = req.params.username;
        const checklist = await waiterAppFactory.getAllWeekDays(username);
        res.render('home', {
            checklist,
            username
        });
    }
    async function gettingWaiterDays (req, res) {
        const username = req.params.username;
        console.log(username);
        const daysID = req.body.day_id;
        console.log(daysID);
        const match = await waiterAppFactory.matchCheckDays(username);
        await waiterAppFactory.insertWaiter(username);
        await waiterAppFactory.daysPassed(daysID, username);
        const checklist = await waiterAppFactory.getAllWeekDays();
        res.render('home', {
            checklist,
            username,
            match
        });
    }

    async function owner (req, res) {
        // let waiter = await waiterAppFactory.getAllWaiters();
        let shifts = await waiterAppFactory.displayShifts();

        // console.log(shifts);

        await waiterAppFactory.displayShifts;
        res.render('owner', {
            shifts

        });
    }

    async function clearDataBaseWaiter (req, res) {
        await waiterAppFactory.clearDayValues();
        res.render('owner', {

        });
    }

    function login (req, res) {
        const owner = req.body.ownerId;
        const waiter = req.body.waiterId;
        console.log(owner);
        console.log(waiter);

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
