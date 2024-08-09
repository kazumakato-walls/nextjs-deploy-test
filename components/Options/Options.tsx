import { Tabs, rem   } from '@mantine/core';
import { FiUser } from "react-icons/fi";
import { FaRegBuilding } from "react-icons/fa";
import { AddCompany } from './AddCompany';
import { AddUser } from './AddUser';
import { UserLists } from './UserList';



// ユーザー追加 会社追加 
export function Options() {
    const iconStyle = { width: rem(12), height: rem(12) };
  return (
    <>
    <Tabs defaultValue="UserList">
      <Tabs.List>
        <Tabs.Tab value="UserList" leftSection={<FiUser style={iconStyle} />}>
          ユーザーリスト
        </Tabs.Tab>

        <Tabs.Tab value="AddUser" leftSection={<FiUser style={iconStyle} />}>
          ユーザー追加
        </Tabs.Tab>

        <Tabs.Tab value="AddCompany" leftSection={<FaRegBuilding style={iconStyle} />}>
          会社追加
        </Tabs.Tab>
        {/* <Tabs.Tab value="settings" leftSection={<FiUser style={iconStyle} />}> */}
        <Tabs.Tab value="Ather" >
          Ather
        </Tabs.Tab>
      </Tabs.List>

      <Tabs.Panel value="UserList">
        <UserLists />
      </Tabs.Panel>

      <Tabs.Panel value="AddCompany">
        <AddCompany />
      </Tabs.Panel>

      <Tabs.Panel value="AddUser">
        <AddUser />
      </Tabs.Panel>

      <Tabs.Panel value="Ather">
        comming soon...
      </Tabs.Panel>
    </Tabs>    
    </>
  );
}
