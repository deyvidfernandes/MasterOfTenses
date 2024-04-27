<!DOCTYPE html>
<html lang="pt-br">
<head>
 <meta charset="UTF-8">
 <meta name="viewport" content="width=device-width, initial-scale=1.0">
 <meta http-equiv="X-UA-Compatible" content="ie=edge">
 <link rel="stylesheet" href="https://www.w3schools.com/w3css/4/w3.css">
 <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/fontawesome/4.7.0/css/font-awesome.min.css">
 <title>Cadastro - PDO</title>
</head>
<body class="w3-black">
<div class="w3-padding w3-content w3-text-grey w3-third w3-display-middle">
<?php
// Verifica se os campos foram submetidos


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
        echo '
        <a href="index.php">
        <h1 class="w3-button w3-blue">Usuário Cadastrado com sucesso </h1>
        </a>
        ';
    } catch(PDOException $e) {
        
        echo $e->getMessage();
        // Falha ao inserir, redireciona de volta para a página de registro com mensagem de erro
        echo '
        <a href="index.php">
        <h1 class="w3-button w3-blue">ERRO! </h1>
        </a>
        ';
    }
} else {
    // Redireciona de volta para a página de registro se os campos não foram submetidos
    header("Location: signup.html");
    exit();
}
?>
</div>

</body>

</html>