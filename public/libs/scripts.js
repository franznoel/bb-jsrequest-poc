
const apiKey = 'nGgXIJa27w3oTpJksSyM84gQXt5tpqiW53et71XQ';
const coachId = '994';
const environment = 'DEV3';
const apiBase = {
    apiCoach: {
        QA3: {
            baseUrl: 'https://twgna8ycg5.execute-api.us-west-2.amazonaws.com/dev',
            apiKey: 'nGgXIJa27w3oTpJksSyM84gQXt5tpqiW53et71XQ'
        },
        DEV3: {
            baseUrl: 'https://c1cqvucuwa.execute-api.us-west-2.amazonaws.com/dev',
            apiKey: 'TrGCBjgsx5UTOwGF5mWW34IwvbwqEf53HSuWjn5i'
        }
    },
    apiReports: {
        DEV2: {
            baseUrl: 'https://ww7d9il358.execute-api.us-west-2.amazonaws.com/dev',
            apiKey: 'cri4JeUoOG8ePtsqCLs583KS4jmy6gqE4p4LlzTj'
        },
        DEV3: {
            baseUrl: 'https://lt0mhw6axk.execute-api.us-west-2.amazonaws.com/dev',
            apiKey: 'QIjSh2aJZT56P2cz4F9nF4BfY9aEoZfO9ntRDCh6'
        },
        STAGE: {
            baseUrl: 'https://fyb6p4nqw2.execute-api.us-west-2.amazonaws.com/dev',
            apiKey: 'ndiQvKrfVu3EwJP19QOlFat4lnB814dcRYlvlgp9'
        }
    }
};

const CoachesModel = function() {
    return {
        count: 0,
        data: [],
        setCount(count) { this.count = count; },
        getCount() { return this.count },
        append(response) { this.data.push(...response); },
        get() { return this.data; }
    };
}

const CustomersModel = function() {
    return {
        count: 0,
        data: []
    };
}

const ProspectsModel = function() {
    return {
        count: 0,
        data: []
    };
};

const NetworkCoachesModel = function() {
    return {
        count: 0,
        data: []
    };
};

const NetworkCustomersModel = function() {
    return {
        count: 0,
        data: []
    };
};

// Controller
$(document).ready(function() {
    const baseCoachUrl = apiBase.apiCoach[environment].baseUrl;
    const baseReportsUrl = apiBase.apiReports[environment].baseUrl;
    const apiCoachKey = apiBase.apiCoach[environment].apiKey;
    const apiReportsKey = apiBase.apiReports[environment].apiKey;

    const countCoachesUrl = `${baseCoachUrl}/coach/${coachId}/contact-counts`;
    const coachesUrl = `${baseCoachUrl}/coach/${coachId}/contacts?pagesize=20000&offset=0`;
    const customersUrl = `${baseCoachUrl}/coach/${coachId}/customers`;
    const prospectsUrl = `${baseCoachUrl}/coach/${coachId}/prospects`;
    const networkCoachesUrl = `${baseReportsUrl}/coach/${coachId}/networks-coaches`;
    const networkCustomersUrl = `${baseReportsUrl}/coach/${coachId}/network-customers`;

    const coaches = CoachesModel();
    const customers = CustomersModel();
    const prospects = ProspectsModel();
    const networkCoaches = NetworkCoachesModel();
    const networkCustomers = NetworkCustomersModel();

    const header = {
        method: 'GET',
        mode: 'cors',
        headers: {
            'Content-Type': 'application/json',
            'x-api-key': apiCoachKey
        },
    };

    fetch(countCoachesUrl, header)
        .then((response) => response.json())
        .then(async function(response) { // Handle Coaches
            if (response.myCoachesCount > 0) {
                coaches.setCount(response.myCoachesCount);
                const kendoData = new kendo.data.DataSource({
                    transport: {
                        read: async function(options) {
                            const recordsCount = coaches.getCount();
                            const data = await new Promise(function(resolve, reject) {
                                fetch(coachesUrl, header)
                                    .then((response) => response.json())
                                    .then((response) => {
                                        coaches.append(response);
                                        const allCoaches = coaches.get();
                                        resolve(allCoaches);
                                    })
                                    .catch((error) => {
                                        reject(error);
                                    });
                            });

                            console.log(data, recordsCount);
                            options.success(data);
                        },
                    },
                    pageSize: 15
                });

                $('#coaches').kendoGrid({
                    // dataSource: await data,
                    dataSource: kendoData,
                    groupable: false,
                    sortable: true,
                    editable: false,
                    pageable: {
                        pageSizes: [5, 10, 15, 20, 50, 100],
                        alwaysVisible: true,
                    },
                    columns: [
                        { field: "id", title: "Coach ID" },
                        { field: "contactType", title: "Contact Type" },
                        { field: "firstName", title: "First Name" },
                        { field: "lastName", title: "Last Name" },
                        { field: "email", title: "Email" },
                        { field: "type", title: "Type" }
                    ]
                });
            }
            return response;
        })
        .then((response) => {
            console.log(response);
        })
        .catch((error) => {
            console.error(error);
        });

    $('#tabstrip').kendoTabStrip({
        animation:  {
            open: {
                effects: 'fadeIn'
            }
        }
    });
});

