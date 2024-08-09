import { Tabs, rem   } from '@mantine/core';
import { FiUser } from "react-icons/fi";
import { FaRegBuilding } from "react-icons/fa";
import { EditUser } from './EditUser';
import { EditPassword } from './EditPassword';


// ユーザー追加 会社追加 
export function Profile() {
    const iconStyle = { width: rem(12), height: rem(12) };
  return (
    <>
    <Tabs defaultValue="EditUser">
      <Tabs.List>
        <Tabs.Tab value="EditUser" leftSection={<FaRegBuilding style={iconStyle} />}>
          ユーザー情報変更
        </Tabs.Tab>
        <Tabs.Tab value="EditPassword" leftSection={<FiUser style={iconStyle} />}>
          パスワード変更
        </Tabs.Tab>
        {/* <Tabs.Tab value="settings" leftSection={<FiUser style={iconStyle} />}> */}
        <Tabs.Tab value="Ather" >
          Ather
        </Tabs.Tab>
      </Tabs.List>

      <Tabs.Panel value="EditUser">
        <EditUser />
      </Tabs.Panel>

      <Tabs.Panel value="EditPassword">
        <EditPassword />
      </Tabs.Panel>

      <Tabs.Panel value="Ather">
        comming soon...
      </Tabs.Panel>
    </Tabs>    
    </>
  );
}
