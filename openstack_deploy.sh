#!/bin/bash

echo "##############################################################"
echo "Bootstrap new openstack instance with following configuration:"
echo "##############################################################"

FLAVOR=$(openstack flavor list -f json | jq '.[0]["Name"]' | tr -d '"')
echo "Flavor: ${FLAVOR}"

IMAGE_ID=$(openstack image list -f json | jq '.[length-1]["ID"]' | tr -d '"')
IMAGE_NAME=$(openstack image list -f json | jq '.[length-1]["Name"]' | tr -d '"')
echo "Image: ${IMAGE_NAME}"

SECURITY_GROUP=$(openstack security group list -f json | jq '.[0]["Name"]' | tr -d '"')
echo "Security group: ${SECURITY_GROUP}"

KEYPAIR=$(openstack keypair list -f json | jq '.[0]["Name"]' | tr -d '"')
echo "Keypair: ${KEYPAIR}"

FLOATING_IP=$(openstack floating ip list -f json | jq '[.[]|if .["Server"] == null then .["Floating IP Address"] else "" end|select(length > 0)]|.[0]' | tr -d '"')
echo "Free IP: ${FLOATING_IP}"

USER_DATA="openstack_bootstrap.file"
echo "Cloud Init File: ${USER_DATA}"

read -p "Sounds good? [y|N]" -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]
then
	echo "Cool. Enter new server name:"
	read servername
    COMMAND="openstack server create \
    	--flavor ${FLAVOR} \
    	--image ${IMAGE_ID} \
    	--security-group ${SECURITY_GROUP} \
    	--key-name ${KEYPAIR} \
    	--user-data ${USER_DATA} \
    	${servername}"
	${COMMAND}

	echo "########### IMPORTANT ############"
	echo "Allocate floating ip after server is ready!"
	IP_COMMAND="openstack server add floating ip ${servername} ${FLOATING_IP}"
	echo "$ ${IP_COMMAND}"
	echo "Now checking server status:"

	OBSERVE_STATUS=true
	while $OBSERVE_STATUS; do
		SERVER_STATUS=$(openstack server show ${servername} -f json | jq '.status' | tr -d '"')
		echo "${SERVER_STATUS}..."
		if [ "$SERVER_STATUS" = "ACTIVE" ] ; then
			${IP_COMMAND}
			OBSERVE_STATUS=false
		fi
		sleep 2
	done

	echo "DONE!"
	echo "http://${FLOATING_IP}/"
fi