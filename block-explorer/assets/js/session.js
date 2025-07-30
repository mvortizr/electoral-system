$(function() {
  $('#loginForm').on('submit', function(e) {
    e.preventDefault();
    var fileInput = document.getElementById('pomFile');
    var file = fileInput.files[0];
    if (!file) {
      $('#loginError').text('Please select a .pom file').show();
      return;
    }
    // Read the .pom file (you can add validation here)
    var reader = new FileReader();
    reader.onload = function(event) {
      var pomContent = event.target.result;
      // TODO: Add your .pom file validation logic here
      // For now, just check if it has some content
      if (pomContent && pomContent.length > 0) {
        window.location.href = 'index.html';
      } else {
        $('#loginError').text('Invalid .pom file').show();
      }
    };
    reader.onerror = function() {
      $('#loginError').text('Error reading .pom file').show();
    };
    reader.readAsText(file);
  });

    // Simple logout: remove session and redirect to login
  $('#logoutBtn').on('click', function(e) {
    e.preventDefault();
    // Aquí puedes limpiar localStorage/sessionStorage si usas tokens
    window.location.href = 'login.html';
  });
});
