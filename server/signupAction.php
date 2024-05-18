<?php
require_once("./util/JWTAuth.php");
require_once("./env.php");

if(isset($_POST['username']) && isset($_POST['email']) && isset($_POST['password']) && isset($_POST['confirm_password'])) {
    // Verifica se as senhas coincidem
    if($_POST['password'] !== $_POST['confirm_password']) {
        // Redireciona de volta para a página de registro com mensagem de erro
        header("Location: ../signup.html?erro=1");
        exit();
    }
    // Conecta ao banco de dados usando PDO
    try {
        $conecta = new PDO("mysql:host=".getenv('DB_URL').";dbname=".getenv('DB_SCHEMA').";port=3306", getenv('DB_USERNAME'), getenv('DB_PASSWORD'));
        $conecta->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    } catch(PDOException $e) {
        // Caso ocorra algum erro na conexão
        die("Conexão falhou: " . $e->getMessage());
    }

    // Monta a consulta SQL para inserção
    $sql = "INSERT INTO table_users (username, email, user_password) VALUES ('{$_POST['username']}', '{$_POST['email']}', '{$_POST['password']}')";

    // Executa a consulta SQL
    try {
        $resultado = $conecta->query($sql);
        $authToken = JWT\generateAuthToken($_POST['email'], getenv('AUTHENTICATION_DURATION_IN_DAYS'));
        JWT\saveAuthTokenInCookie($authToken, getenv('AUTHENTICATION_DURATION_IN_DAYS'));
        header("Location: ../index.php");
    } catch(PDOException $e) {
        echo $e->getMessage();
        exit();
        header("Location: ../signup.html?erro=1");
    }
} else {
    // Redireciona de volta para a página de registro se os campos não foram submetidos
    header("Location: ../signup.html");
    exit();
}

