function isError(response) {
    if (response.ok) {
        return response;
    } else {
        response.text().then(text => {
            window.location.assign(window.location.origin + "/error?errorid=" + response.status + "&errormsg=" + encodeURIComponent(text));
            return false;
        })
    }
}