<!doctype html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, user-scalable=no, initial-scale=1.0">
    <title>Restauración de contraseña</title>
</head>
    <body>
        <p>Hola! Se ha restaurado tu contraseña {{ $user->nombre }} {{ $user->apellido }}</p>
        <p>Tus credenciales de entrada nueva son: </p>
        <ul>
            <li>Usuario: {{ $user->usuario }}</li>
            <li>Nueva contraseña: {{ $user->contraseña }}</li>
        </ul>
        <p>Gracias por usar nuestros servicios!</p>
        
    </body>
</html>