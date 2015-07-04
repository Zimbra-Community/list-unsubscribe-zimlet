Zimbra list-unsubscribe Zimlet
==========

Implements an Unsubscribe button in Zimbra based on the List-Unsubscribe header
as defined by http://www.list-unsubscribe.com/ or RFC 2369

Screenshot: https://raw.githubusercontent.com/barrydegraaff/list-unsubscribe-zimlet/master/list-unsubscribe.png

If you find Zimbra OpenPGP Zimlet useful and want to support its continued development, you can make donations via:
- PayPal: info@barrydegraaff.tk
- Bitcoin: 1BaRRyS7wvGarEGgDwmPgRCygzcvocyxJt
- Bank transfer: IBAN NL55ABNA0623226413 ; BIC ABNANL2A

========================================================================

### Installing

    su zimbra
    cd /tmp
    rm tk_barrydegraaff_list_unsubscribe*
    wget https://github.com/barrydegraaff/list-unsubscribe-zimlet/raw/master/tk_barrydegraaff_list_unsubscribe.zip
    zmzimletctl deploy tk_barrydegraaff_list_unsubscribe.zip
    (wait 15 minutes for the deploy to propagate; or zmprov fc all && zmmailboxdctl restart)

### InstallingUsing development mode:

    mkdir -p /opt/zimbra/zimlets-deployed/_dev/tk_barrydegraaff_list_unsubscribe
    cd /opt/zimbra/zimlets-deployed/_dev/tk_barrydegraaff_list_unsubscribe
    wget https://raw.githubusercontent.com/barrydegraaff/list-unsubscribe-zimlet/master/tk_barrydegraaff_list_unsubscribe.xml
    wget https://raw.githubusercontent.com/barrydegraaff/list-unsubscribe-zimlet/master/tk_barrydegraaff_list_unsubscribe.js


========================================================================

### License

Copyright (C) 2015  Barry de Graaff

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see http://www.gnu.org/licenses/.
