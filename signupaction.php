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
    $username = "seu_usuario"; // Nome de usuário do MySQL
    $password = "sua_senha"; // Senha do MySQL
    $dbname = "master_of_tenses"; // Nome do banco de dados
    
    // Conecta ao banco de dados
    $conn = new mysqli($servername, $username, $password, $dbname);
    
    // Verifica se a conexão foi bem sucedida
    if ($conn->connect_error) {
        die("Conexão falhou: " . $conn->connect_error);
    }

    // Evita injeção de SQL usando prepared statements
    $stmt = $conn->prepare("INSERT INTO users (username, email, senha) VALUES (?, ?, ?)");
    $stmt->bind_param("sss", $_POST['username'], $_POST['email'], $_POST['password']);
    
    // Executa a inserção
    if ($stmt->execute() === TRUE) {
        // Registro bem-sucedido, redireciona para a página de sucesso
        header("Location: sucesso_signup.php");
        exit();
    } else {
        // Falha ao inserir, redireciona de volta para a página de registro com mensagem de erro
        header("Location: signup.html?erro=2");
        exit();
    }
    
    // Fecha a conexão com o banco de dados
    $stmt->close();
    $conn->close();
} else {
    // Redireciona de volta para a página de registro se os campos não foram submetidos
    header("Location: signup.html");
    exit();
}
?>