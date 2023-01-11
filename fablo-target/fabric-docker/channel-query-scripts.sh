#!/usr/bin/env bash

source "$FABLO_NETWORK_ROOT/fabric-docker/scripts/channel-query-functions.sh"

set -eu

channelQuery() {
  echo "-> Channel query: " + "$@"

  if [ "$#" -eq 1 ]; then
    printChannelsHelp

  elif [ "$1" = "list" ] && [ "$2" = "user" ] && [ "$3" = "peer0" ]; then

    peerChannelList "cli.user.com" "peer0.user.com:7041"

  elif
    [ "$1" = "list" ] && [ "$2" = "administrator" ] && [ "$3" = "peer0" ]
  then

    peerChannelList "cli.administrator.com" "peer0.administrator.com:7061"

  elif

    [ "$1" = "getinfo" ] && [ "$2" = "warranty-channel" ] && [ "$3" = "user" ] && [ "$4" = "peer0" ]
  then

    peerChannelGetInfo "warranty-channel" "cli.user.com" "peer0.user.com:7041"

  elif [ "$1" = "fetch" ] && [ "$2" = "config" ] && [ "$3" = "warranty-channel" ] && [ "$4" = "user" ] && [ "$5" = "peer0" ]; then
    TARGET_FILE=${6:-"$channel-config.json"}

    peerChannelFetchConfig "warranty-channel" "cli.user.com" "$TARGET_FILE" "peer0.user.com:7041"

  elif [ "$1" = "fetch" ] && [ "$3" = "warranty-channel" ] && [ "$4" = "user" ] && [ "$5" = "peer0" ]; then
    BLOCK_NAME=$2
    TARGET_FILE=${6:-"$BLOCK_NAME.block"}

    peerChannelFetchBlock "warranty-channel" "cli.user.com" "${BLOCK_NAME}" "peer0.user.com:7041" "$TARGET_FILE"

  elif
    [ "$1" = "getinfo" ] && [ "$2" = "warranty-channel" ] && [ "$3" = "administrator" ] && [ "$4" = "peer0" ]
  then

    peerChannelGetInfo "warranty-channel" "cli.administrator.com" "peer0.administrator.com:7061"

  elif [ "$1" = "fetch" ] && [ "$2" = "config" ] && [ "$3" = "warranty-channel" ] && [ "$4" = "administrator" ] && [ "$5" = "peer0" ]; then
    TARGET_FILE=${6:-"$channel-config.json"}

    peerChannelFetchConfig "warranty-channel" "cli.administrator.com" "$TARGET_FILE" "peer0.administrator.com:7061"

  elif [ "$1" = "fetch" ] && [ "$3" = "warranty-channel" ] && [ "$4" = "administrator" ] && [ "$5" = "peer0" ]; then
    BLOCK_NAME=$2
    TARGET_FILE=${6:-"$BLOCK_NAME.block"}

    peerChannelFetchBlock "warranty-channel" "cli.administrator.com" "${BLOCK_NAME}" "peer0.administrator.com:7061" "$TARGET_FILE"

  else

    echo "$@"
    echo "$1, $2, $3, $4, $5, $6, $7, $#"
    printChannelsHelp
  fi

}

printChannelsHelp() {
  echo "Channel management commands:"
  echo ""

  echo "fablo channel list user peer0"
  echo -e "\t List channels on 'peer0' of 'User'".
  echo ""

  echo "fablo channel list administrator peer0"
  echo -e "\t List channels on 'peer0' of 'Administrator'".
  echo ""

  echo "fablo channel getinfo warranty-channel user peer0"
  echo -e "\t Get channel info on 'peer0' of 'User'".
  echo ""
  echo "fablo channel fetch config warranty-channel user peer0 [file-name.json]"
  echo -e "\t Download latest config block and save it. Uses first peer 'peer0' of 'User'".
  echo ""
  echo "fablo channel fetch <newest|oldest|block-number> warranty-channel user peer0 [file name]"
  echo -e "\t Fetch a block with given number and save it. Uses first peer 'peer0' of 'User'".
  echo ""

  echo "fablo channel getinfo warranty-channel administrator peer0"
  echo -e "\t Get channel info on 'peer0' of 'Administrator'".
  echo ""
  echo "fablo channel fetch config warranty-channel administrator peer0 [file-name.json]"
  echo -e "\t Download latest config block and save it. Uses first peer 'peer0' of 'Administrator'".
  echo ""
  echo "fablo channel fetch <newest|oldest|block-number> warranty-channel administrator peer0 [file name]"
  echo -e "\t Fetch a block with given number and save it. Uses first peer 'peer0' of 'Administrator'".
  echo ""

}
