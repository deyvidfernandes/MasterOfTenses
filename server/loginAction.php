<?php
// Verifica se os campos de nome de usuário e senha foram submetidos
if(isset($_POST['username']) && isset($_POST['password'])) {
    // Dados de conexão com o banco de dados
    $servername = "localhost"; // Nome do servidor MySQL
    $username = "root"; // Nome de usuário do MySQL
    $password = "2712"; // Senha do MySQL
    $dbname = "master_of_tenses"; // Nome do banco de dados
    
    // Conecta ao banco de dados
    $conn = new mysqli($servername, $username, $password, $dbname);
    
    // Verifica se a conexão foi bem sucedida
    if ($conn->connect_error) {
        die("Conexão falhou: " . $conn->connect_error);
    }
    
    // Evita injeção de SQL usando prepared statements
    $stmt = $conn->prepare("SELECT * FROM table_users WHERE (email=? OR username=?) AND user_password=?");
    $stmt->bind_param("sss", $_POST['username'], $_POST['username'], $_POST['password']);
    $stmt->execute();
    $result = $stmt->get_result();
    
    // Verifica se o usuário foi encontrado no banco de dados
    if ($result->num_rows == 1) {
        // Usuário autenticado com sucesso, redireciona para a página de sucesso
        header("Location: ../index.php");
        exit();
    } else {
        // Usuário ou senha incorretos, redireciona de volta para a página de login com mensagem de erro
        header("Location: ../login.html?erro=1");
        exit();
    }
    
    // Fecha a conexão com o banco de dados
    $stmt->close();
    $conn->close();
} else {
    // Redireciona de volta para a página de login se os campos não foram submetidos
    header("Location: ../login.html?erro=2");
    exit();
}