/* document.getElementById('toggleSenha').addEventListener('click', function() {
    const senha = document.getElementById('senha');
    const tipo = senha.getAttribute('type') === 'password' ? 'text' : 'password';
    senha.setAttribute('type', tipo);
    this.classList.toggle('fa-eye');
    this.classList.toggle('fa-eye-slash');
});
 */
/* document.querySelectorAll('.toggleSenha').forEach(function(btn) {
    btn.addEventListener('click', function() {
        const senha = document.querySelector('.senha');
        const tipo = senha.getAttribute('type') === 'password' ? 'text' : 'password';
        senha.setAttribute('type', tipo);
        this.classList.toggle('fa-eye');
        this.classList.toggle('fa-eye-slash');
    });
}); */

document.querySelectorAll('.toggleSenha').forEach(function(btn) {
    btn.addEventListener('click', function() {
        const senha = this.previousElementSibling;

        const tipo = senha.type === 'password' ? 'text' : 'password';
        senha.type = tipo;

        this.classList.toggle('fa-eye');
        this.classList.toggle('fa-eye-slash');
    });
});
