IF NOT EXISTS (SELECT * FROM sys.databases WHERE name = 'TicTacToe')
BEGIN
    CREATE DATABASE TicTacToe;
END;
