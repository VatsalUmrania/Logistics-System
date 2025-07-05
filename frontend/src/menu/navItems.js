import masterDataMenu from './masterDataMenu';
import supplierMenu from './supplierMenu';
import clearanceMenu from './clearanceMenu';
import reportsMenu from './reportsMenu';
import accountsMenu from './accountsMenu';

import {
  Home, Database, Truck, FileCheck, CreditCard, FileText, Users
} from "lucide-react";
import { href } from 'react-router-dom';

const navItems = [
  { icon: Home, text: 'Dashboard', id: 'home', color: 'text-violet-600', Link:"/home"},
  { icon: Database, text: 'Master Data', hasDropdown: true, id: 'master', color: 'text-indigo-600', dropdownItems: masterDataMenu },
  { icon: Truck, text: 'Suppliers', hasDropdown: true, id: 'supplier', color: 'text-white-600', dropdownItems: supplierMenu },
  { icon: FileCheck, text: 'Custom Clearance', hasDropdown: true, id: 'clearance', color: 'text-orange-600', dropdownItems: clearanceMenu },
  { icon: CreditCard, text: 'Payments', id: 'payment', color: 'text-pink-600' },
  { icon: FileText, text: 'Reports', hasDropdown: true, id: 'reports', color: 'text-indigo-600', dropdownItems: reportsMenu },
  { icon: Users, text: 'Accounts', hasDropdown: true, id: 'accounts', color: 'text-teal-600', dropdownItems: accountsMenu },
];

export default navItems;
