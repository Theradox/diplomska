#!/usr/bin/env bash

generateArtifacts() {
  printHeadline "Generating basic configs" "U1F913"

  printItalics "Generating crypto material for Orderer" "U1F512"
  certsGenerate "$FABLO_NETWORK_ROOT/fabric-config" "crypto-config-orderer.yaml" "peerOrganizations/orderer.com" "$FABLO_NETWORK_ROOT/fabric-config/crypto-config/"

  printItalics "Generating crypto material for User" "U1F512"
  certsGenerate "$FABLO_NETWORK_ROOT/fabric-config" "crypto-config-user.yaml" "peerOrganizations/user.com" "$FABLO_NETWORK_ROOT/fabric-config/crypto-config/"

  printItalics "Generating crypto material for Administrator" "U1F512"
  certsGenerate "$FABLO_NETWORK_ROOT/fabric-config" "crypto-config-administrator.yaml" "peerOrganizations/administrator.com" "$FABLO_NETWORK_ROOT/fabric-config/crypto-config/"

  printItalics "Generating genesis block for group group1" "U1F3E0"
  genesisBlockCreate "$FABLO_NETWORK_ROOT/fabric-config" "$FABLO_NETWORK_ROOT/fabric-config/config" "Group1Genesis"

  # Create directory for chaincode packages to avoid permission errors on linux
  mkdir -p "$FABLO_NETWORK_ROOT/fabric-config/chaincode-packages"
}

startNetwork() {
  printHeadline "Starting network" "U1F680"
  (cd "$FABLO_NETWORK_ROOT"/fabric-docker && docker-compose up -d)
  sleep 4
}

generateChannelsArtifacts() {
  printHeadline "Generating config for 'warranty-channel'" "U1F913"
  createChannelTx "warranty-channel" "$FABLO_NETWORK_ROOT/fabric-config" "WarrantyChannel" "$FABLO_NETWORK_ROOT/fabric-config/config"
}

installChannels() {
  printHeadline "Creating 'warranty-channel' on User/peer0" "U1F63B"
  docker exec -i cli.user.com bash -c "source scripts/channel_fns.sh; createChannelAndJoin 'warranty-channel' 'UserMSP' 'peer0.user.com:7041' 'crypto/users/Admin@user.com/msp' 'orderer0.group1.orderer.com:7030';"

  printItalics "Joining 'warranty-channel' on  Administrator/peer0" "U1F638"
  docker exec -i cli.administrator.com bash -c "source scripts/channel_fns.sh; fetchChannelAndJoin 'warranty-channel' 'AdministratorMSP' 'peer0.administrator.com:7061' 'crypto/users/Admin@administrator.com/msp' 'orderer0.group1.orderer.com:7030';"
}

installChaincodes() {
  if [ -n "$(ls "$CHAINCODES_BASE_DIR/./chaincodes/chaincode")" ]; then
    local version="0.0.1"
    printHeadline "Packaging chaincode 'warranty-chaincode'" "U1F60E"
    chaincodeBuild "warranty-chaincode" "node" "$CHAINCODES_BASE_DIR/./chaincodes/chaincode" "16"
    chaincodePackage "cli.user.com" "peer0.user.com:7041" "warranty-chaincode" "$version" "node" printHeadline "Installing 'warranty-chaincode' for User" "U1F60E"
    chaincodeInstall "cli.user.com" "peer0.user.com:7041" "warranty-chaincode" "$version" ""
    chaincodeApprove "cli.user.com" "peer0.user.com:7041" "warranty-channel" "warranty-chaincode" "$version" "orderer0.group1.orderer.com:7030" "OR('UserMSP.member', 'AdministratorMSP.member')" "false" "" ""
    printHeadline "Installing 'warranty-chaincode' for Administrator" "U1F60E"
    chaincodeInstall "cli.administrator.com" "peer0.administrator.com:7061" "warranty-chaincode" "$version" ""
    chaincodeApprove "cli.administrator.com" "peer0.administrator.com:7061" "warranty-channel" "warranty-chaincode" "$version" "orderer0.group1.orderer.com:7030" "OR('UserMSP.member', 'AdministratorMSP.member')" "false" "" ""
    printItalics "Committing chaincode 'warranty-chaincode' on channel 'warranty-channel' as 'User'" "U1F618"
    chaincodeCommit "cli.user.com" "peer0.user.com:7041" "warranty-channel" "warranty-chaincode" "$version" "orderer0.group1.orderer.com:7030" "OR('UserMSP.member', 'AdministratorMSP.member')" "false" "" "peer0.user.com:7041,peer0.administrator.com:7061" "" ""
  else
    echo "Warning! Skipping chaincode 'warranty-chaincode' installation. Chaincode directory is empty."
    echo "Looked in dir: '$CHAINCODES_BASE_DIR/./chaincodes/chaincode'"
  fi

}

installChaincode() {
  local chaincodeName="$1"
  if [ -z "$chaincodeName" ]; then
    echo "Error: chaincode name is not provided"
    exit 1
  fi

  local version="$2"
  if [ -z "$version" ]; then
    echo "Error: chaincode version is not provided"
    exit 1
  fi

  if [ "$chaincodeName" = "warranty-chaincode" ]; then
    if [ -n "$(ls "$CHAINCODES_BASE_DIR/./chaincodes/chaincode")" ]; then
      printHeadline "Packaging chaincode 'warranty-chaincode'" "U1F60E"
      chaincodeBuild "warranty-chaincode" "node" "$CHAINCODES_BASE_DIR/./chaincodes/chaincode" "16"
      chaincodePackage "cli.user.com" "peer0.user.com:7041" "warranty-chaincode" "$version" "node" printHeadline "Installing 'warranty-chaincode' for User" "U1F60E"
      chaincodeInstall "cli.user.com" "peer0.user.com:7041" "warranty-chaincode" "$version" ""
      chaincodeApprove "cli.user.com" "peer0.user.com:7041" "warranty-channel" "warranty-chaincode" "$version" "orderer0.group1.orderer.com:7030" "OR('UserMSP.member', 'AdministratorMSP.member')" "false" "" ""
      printHeadline "Installing 'warranty-chaincode' for Administrator" "U1F60E"
      chaincodeInstall "cli.administrator.com" "peer0.administrator.com:7061" "warranty-chaincode" "$version" ""
      chaincodeApprove "cli.administrator.com" "peer0.administrator.com:7061" "warranty-channel" "warranty-chaincode" "$version" "orderer0.group1.orderer.com:7030" "OR('UserMSP.member', 'AdministratorMSP.member')" "false" "" ""
      printItalics "Committing chaincode 'warranty-chaincode' on channel 'warranty-channel' as 'User'" "U1F618"
      chaincodeCommit "cli.user.com" "peer0.user.com:7041" "warranty-channel" "warranty-chaincode" "$version" "orderer0.group1.orderer.com:7030" "OR('UserMSP.member', 'AdministratorMSP.member')" "false" "" "peer0.user.com:7041,peer0.administrator.com:7061" "" ""

    else
      echo "Warning! Skipping chaincode 'warranty-chaincode' install. Chaincode directory is empty."
      echo "Looked in dir: '$CHAINCODES_BASE_DIR/./chaincodes/chaincode'"
    fi
  fi
}

runDevModeChaincode() {
  local chaincodeName=$1
  if [ -z "$chaincodeName" ]; then
    echo "Error: chaincode name is not provided"
    exit 1
  fi

  if [ "$chaincodeName" = "warranty-chaincode" ]; then
    local version="0.0.1"
    printHeadline "Approving 'warranty-chaincode' for User (dev mode)" "U1F60E"
    chaincodeApprove "cli.user.com" "peer0.user.com:7041" "warranty-channel" "warranty-chaincode" "0.0.1" "orderer0.group1.orderer.com:7030" "OR('UserMSP.member', 'AdministratorMSP.member')" "false" "" ""
    printHeadline "Approving 'warranty-chaincode' for Administrator (dev mode)" "U1F60E"
    chaincodeApprove "cli.administrator.com" "peer0.administrator.com:7061" "warranty-channel" "warranty-chaincode" "0.0.1" "orderer0.group1.orderer.com:7030" "OR('UserMSP.member', 'AdministratorMSP.member')" "false" "" ""
    printItalics "Committing chaincode 'warranty-chaincode' on channel 'warranty-channel' as 'User' (dev mode)" "U1F618"
    chaincodeCommit "cli.user.com" "peer0.user.com:7041" "warranty-channel" "warranty-chaincode" "0.0.1" "orderer0.group1.orderer.com:7030" "OR('UserMSP.member', 'AdministratorMSP.member')" "false" "" "peer0.user.com:7041,peer0.administrator.com:7061" "" ""

  fi
}

upgradeChaincode() {
  local chaincodeName="$1"
  if [ -z "$chaincodeName" ]; then
    echo "Error: chaincode name is not provided"
    exit 1
  fi

  local version="$2"
  if [ -z "$version" ]; then
    echo "Error: chaincode version is not provided"
    exit 1
  fi

  if [ "$chaincodeName" = "warranty-chaincode" ]; then
    if [ -n "$(ls "$CHAINCODES_BASE_DIR/./chaincodes/chaincode")" ]; then
      printHeadline "Packaging chaincode 'warranty-chaincode'" "U1F60E"
      chaincodeBuild "warranty-chaincode" "node" "$CHAINCODES_BASE_DIR/./chaincodes/chaincode" "16"
      chaincodePackage "cli.user.com" "peer0.user.com:7041" "warranty-chaincode" "$version" "node" printHeadline "Installing 'warranty-chaincode' for User" "U1F60E"
      chaincodeInstall "cli.user.com" "peer0.user.com:7041" "warranty-chaincode" "$version" ""
      chaincodeApprove "cli.user.com" "peer0.user.com:7041" "warranty-channel" "warranty-chaincode" "$version" "orderer0.group1.orderer.com:7030" "OR('UserMSP.member', 'AdministratorMSP.member')" "false" "" ""
      printHeadline "Installing 'warranty-chaincode' for Administrator" "U1F60E"
      chaincodeInstall "cli.administrator.com" "peer0.administrator.com:7061" "warranty-chaincode" "$version" ""
      chaincodeApprove "cli.administrator.com" "peer0.administrator.com:7061" "warranty-channel" "warranty-chaincode" "$version" "orderer0.group1.orderer.com:7030" "OR('UserMSP.member', 'AdministratorMSP.member')" "false" "" ""
      printItalics "Committing chaincode 'warranty-chaincode' on channel 'warranty-channel' as 'User'" "U1F618"
      chaincodeCommit "cli.user.com" "peer0.user.com:7041" "warranty-channel" "warranty-chaincode" "$version" "orderer0.group1.orderer.com:7030" "OR('UserMSP.member', 'AdministratorMSP.member')" "false" "" "peer0.user.com:7041,peer0.administrator.com:7061" "" ""

    else
      echo "Warning! Skipping chaincode 'warranty-chaincode' upgrade. Chaincode directory is empty."
      echo "Looked in dir: '$CHAINCODES_BASE_DIR/./chaincodes/chaincode'"
    fi
  fi
}

notifyOrgsAboutChannels() {
  printHeadline "Creating new channel config blocks" "U1F537"
  createNewChannelUpdateTx "warranty-channel" "UserMSP" "WarrantyChannel" "$FABLO_NETWORK_ROOT/fabric-config" "$FABLO_NETWORK_ROOT/fabric-config/config"
  createNewChannelUpdateTx "warranty-channel" "AdministratorMSP" "WarrantyChannel" "$FABLO_NETWORK_ROOT/fabric-config" "$FABLO_NETWORK_ROOT/fabric-config/config"

  printHeadline "Notyfing orgs about channels" "U1F4E2"
  notifyOrgAboutNewChannel "warranty-channel" "UserMSP" "cli.user.com" "peer0.user.com" "orderer0.group1.orderer.com:7030"
  notifyOrgAboutNewChannel "warranty-channel" "AdministratorMSP" "cli.administrator.com" "peer0.administrator.com" "orderer0.group1.orderer.com:7030"

  printHeadline "Deleting new channel config blocks" "U1F52A"
  deleteNewChannelUpdateTx "warranty-channel" "UserMSP" "cli.user.com"
  deleteNewChannelUpdateTx "warranty-channel" "AdministratorMSP" "cli.administrator.com"
}

printStartSuccessInfo() {
  printHeadline "Done! Enjoy your fresh network" "U1F984"
}

stopNetwork() {
  printHeadline "Stopping network" "U1F68F"
  (cd "$FABLO_NETWORK_ROOT"/fabric-docker && docker-compose stop)
  sleep 4
}

networkDown() {
  printHeadline "Destroying network" "U1F916"
  (cd "$FABLO_NETWORK_ROOT"/fabric-docker && docker-compose down)

  printf "\nRemoving chaincode containers & images... \U1F5D1 \n"
  for container in $(docker ps -a | grep "dev-peer0.user.com-warranty-chaincode" | awk '{print $1}'); do
    echo "Removing container $container..."
    docker rm -f "$container" || echo "docker rm of $container failed. Check if all fabric dockers properly was deleted"
  done
  for image in $(docker images "dev-peer0.user.com-warranty-chaincode*" -q); do
    echo "Removing image $image..."
    docker rmi "$image" || echo "docker rmi of $image failed. Check if all fabric dockers properly was deleted"
  done
  for container in $(docker ps -a | grep "dev-peer0.administrator.com-warranty-chaincode" | awk '{print $1}'); do
    echo "Removing container $container..."
    docker rm -f "$container" || echo "docker rm of $container failed. Check if all fabric dockers properly was deleted"
  done
  for image in $(docker images "dev-peer0.administrator.com-warranty-chaincode*" -q); do
    echo "Removing image $image..."
    docker rmi "$image" || echo "docker rmi of $image failed. Check if all fabric dockers properly was deleted"
  done

  printf "\nRemoving generated configs... \U1F5D1 \n"
  rm -rf "$FABLO_NETWORK_ROOT/fabric-config/config"
  rm -rf "$FABLO_NETWORK_ROOT/fabric-config/crypto-config"
  rm -rf "$FABLO_NETWORK_ROOT/fabric-config/chaincode-packages"

  printHeadline "Done! Network was purged" "U1F5D1"
}
