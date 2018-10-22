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

    function login (req, res) {
        const owner = req.body.ownerId;
        const waiter = req.body.waiterId;
        console.log(owner);
        console.log(waiter);

        if (owner !== '') {
          return res.render('./owner');
        };
        if (waiter !== '') {
            return res.redirect('/waiter/' + waiter);
        };
        if(waiter === '' && owner === '') {
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
