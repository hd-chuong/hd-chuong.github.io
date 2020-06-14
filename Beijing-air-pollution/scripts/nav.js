function ExtendNavBar()
{
    document.getElementById("home-button").innerHTML = "<i class='fas fa-home'></i> Home";
    document.getElementById("explore-button").innerHTML = "<i class='fas fa-sun'></i> Explore";
    document.getElementById("dashboard-button").innerHTML = "<i class='fas fa-columns'></i> Dashboard"; 
}

function ShrinkNavBar()
{
    document.getElementById("home-button").innerHTML = "<i class='fas fa-home'></i>";
    document.getElementById("explore-button").innerHTML = "<i class='fas fa-sun'></i>";
    document.getElementById("dashboard-button").innerHTML = "<i class='fas fa-columns'></i>";
}

function InitMenu()
{
    document.getElementById("navbar").addEventListener("mouseover", ExtendNavBar);
    document.getElementById("navbar").addEventListener("mouseleave", ShrinkNavBar);
    document.getElementById("home-button").addEventListener("click", function() {
        location.href = "home.html";
    })
    document.getElementById("dashboard-button").addEventListener("click", function() {
        location.href = "dashboard.html";
    })
    document.getElementById("explore-button").addEventListener("click", function() {
        location.href = "overview.html";
    })
}

function InitToolBar() {
    stationInput = document.getElementById("station");
    stationInput.addEventListener("change", function() {
        DisplayDashboard(stationInput.value, "aqi");
    })
}