# Use of Enterprise blockchain for warranty management and proof of ownership

Овој проект претставува мојата теза за дипломирање @ ФИНКИ Скопје, 2023

#### Членови на тимот: Бојан Спасовски, 173164

## Искористени технологии:
* **Blockchain**
  * Hyperledger Fabric
  * ChainCode
  * Fablo
  * Javascript
  
* **Backend**
  * NodeJS
  * NestJS
  * MySQL


* **Frontend**
  * React
  * Typescript
  * Javascript
  * Bootstrap - General style and design
  * FontAwesome
  * HTML
  * CSS

* **DevOps**

  * Docker - Database Build
  
  ## Инструкции: 
  1. sudo ./fablo start (if first time) start/stop ONLY to keep saved data

  2. vo backend -> docker-compose up -d

  3. vo backend -> npm run start

  4. vo frontend -> npm run start



docker exec cli.user.com peer chaincode invoke peer0.user.com -C "warranty-channel" -n "warranty-chaincode" -c '{"Args":["WarrantyContract:AssignWarrantyOwnership", "asd123", "BojanOwner"]}'

docker exec cli.user.com peer chaincode invoke peer0.user.com -C "warranty-channel" -n "warranty-chaincode" -c '{"Args":["WarrantyContract:GetAllWarranties"]}'

docker exec cli.user.com peer chaincode invoke peer0.user.com -C "warranty-channel" -n "warranty-chaincode" -c '{"Args":["WarrantyContract:CreateWarranty", "asd1234", "BojanIssuer", "bojanOwner", "BojanService", "2024-01-02"]}'


docker exec cli.user.com peer chaincode invoke peer0.user.com -C "warranty-channel" -n "warranty-chaincode" -c '{"Args":["WarrantyContract:QueryWarrantiesByOwner", "aa"]}'

docker exec cli.user.com peer chaincode invoke peer0.user.com -C "warranty-channel" -n "warranty-chaincode" -c '{"Args":["WarrantyContract:GetHistoryForWarranty", "asd123"]}'
