<?php

if(isset($_POST['username']) && isset($_POST['email']) && isset($_POST['password']) && isset($_POST['confirm_password'])) {
    // Verifica se as senhas coincidem
    if($_POST['password'] !== $_POST['confirm_password']) {
        // Redireciona de volta para a página de registro com mensagem de erro
        header("Location: signup.html?erro=1");
        exit();
    }

    // Dados de conexão com o banco de dados
    $servername = "localhost"; // Nome do servidor MySQL
    $username = "root"; // Nome de usuário do MySQL
    $password = "2712"; // Senha do MySQL
    $dbname = "master_of_tenses"; // Nome do banco de dados
    
    // Conecta ao banco de dados usando PDO
    try {
        $conecta = new PDO("mysql:host=$servername;dbname=$dbname;port=3306", $username, $password);
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
        header("Location: ../index.php");
    } catch(PDOException $e) {
        header("Location: signup.html?erro=1");
    }
} else {
    // Redireciona de volta para a página de registro se os campos não foram submetidos
    header("Location: signup.html");
    exit();
}