function loaddata( dataloaded ) {
    //var q = d3.queue();
    //q.defer(d3.csv, "./data.csv");
    //q.defer(d3.csv, "./predicted_data.csv");
    //q.await(function(data) {
    Promise.all([
        d3.csv('./data.csv'),
        d3.csv('./predicted_data.csv')
    ]).then(function(data) {
        f1=data[0][0];
        f2=data[1];
        scene1data = {
            fed_debt: parseFloat(f1.Federal_Debt),
            h_debt: parseFloat(f1.Household_Debt),
            gdp: parseFloat(f1.GDP),
            income: parseFloat(f1.Disposable_Income),
            gdp_ratio: parseFloat(f1.Debt_GDP),
            income_ratio: parseFloat(f1.Household_Disposable_Income)
            };
        debt_data = {
            fed_debt: parseFloat(f1.Federal_Debt),
            h_debt: parseFloat(f1.Household_Debt)
            };
        income_data = {
            gdp: parseFloat(f1.GDP),
            income: parseFloat(f1.Household_Disposable_Income)
            };
        ratio_data = {
            gdp_ratio: parseFloat(f1.Debt_GDP),
            income_ratio: parseFloat(f1.Household_Debt_GDP)
            };
        scene2data = {
            inflation: parseFloat(f1.Inflation),
            fed_int: parseFloat(f1.Interest_Rate),
            h_int: parseFloat(f1.Household_Average_Interest_Rate),
            eff_fed_int: parseFloat(f1.Effective_Interest_Rate),
            eff_h_int: parseFloat(f1.Effective_Household_Interest)
            };
        inflation_data = {
            inflation: parseFloat(f1.Inflation)
            };
        interest_data = {
            fed_int: parseFloat(f1.Interest_Rate),
            h_int: parseFloat(f1.Household_Average_Interest_Rate)
            };
        eff_interest_data = {
            eff_fed_int: parseFloat(f1.Effective_Interest_Rate),
            eff_h_int: parseFloat(f1.Effective_Household_Interest)
            };
        f2.forEach(function (o) {
            Object.keys(o).forEach(function (k) {
                scene3data[k] = scene3data[k] || [];
                scene3data[k].push(o[k]);
            });
        });
        dataloaded();
       }
    );
}
