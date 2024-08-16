{ pkgs }: {
  deps = [
    pkgs.zip
    pkgs.tree
    pkgs.unzip
    pkgs.wget
    pkgs.python310Packages.pyngrok
    pkgs.python311Packages.pyngrok
    pkgs.lsof
    pkgs.nano
    pkgs.nodejs-16_x
    pkgs.mongodb
    pkgs.ngrok
  ];
}
