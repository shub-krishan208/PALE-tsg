#!/bin/bash
echo "creating start.sh ..."
cd ~
touch start.sh

cat << 'EOF' > start.sh
#!/bin/bash
psql -h localhost -p 5432 -U postgres -d library
EOF

chmod +x start.sh
echo "start script created in /"