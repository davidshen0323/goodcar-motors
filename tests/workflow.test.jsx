import { it, expect } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { I18nProvider } from '../src/shared/i18n/I18nProvider';
import App from '../src/App';
function open(path = '/') {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <I18nProvider>
        <App />
      </I18nProvider>
    </MemoryRouter>,
  );
}
it('saves an inquiry then shows and closes it in the management page', async () => {
  const user = userEvent.setup();
  open();
  await user.selectOptions(screen.getByLabelText('想詢問的車輛'), 'AS-101');
  await user.type(screen.getByLabelText('稱呼'), 'Test user');
  await user.type(screen.getByLabelText('聯絡方式'), 'test@example.com');
  await user.click(screen.getByRole('button', { name: /儲存本機詢問/ }));
  expect(screen.getByText('詢問已儲存，可至管理頁查看。')).toBeInTheDocument();
  await user.click(screen.getAllByRole('link', { name: /車源管理/ })[0]);
  await user.click(screen.getByRole('button', { name: /詢問管理/ }));
  expect(screen.getByText('test@example.com')).toBeInTheDocument();
  await user.click(screen.getByRole('button', { name: '標記已聯絡' }));
  await user.click(screen.getByRole('button', { name: '結案' }));
  expect(screen.getByText('已結案，狀態已鎖定。')).toBeInTheDocument();
  expect(
    JSON.parse(localStorage.getItem('atelier-inquiries-v1'))[0].history,
  ).toHaveLength(3);
});
it('edits inventory and hides sold vehicles when returning to the collection', async () => {
  const user = userEvent.setup();
  open('/admin.html');
  await user.click(screen.getByRole('button', { name: '編輯 歐系中型房車' }));
  const dialog = screen.getByRole('dialog');
  await user.selectOptions(within(dialog).getByLabelText('狀態'), 'sold');
  await user.click(within(dialog).getByRole('button', { name: /儲存車源/ }));
  await user.click(screen.getByRole('link', { name: /返回車源前台/ }));
  expect(
    screen.queryByRole('heading', { name: '歐系中型房車' }),
  ).not.toBeInTheDocument();
  expect(screen.getAllByRole('checkbox', { name: '加入比較' })).toHaveLength(2);
});
it('persists favorites and filters the collection', async () => {
  const user = userEvent.setup();
  open();
  await user.click(screen.getByRole('button', { name: '收藏 歐系豪華休旅' }));
  await user.click(screen.getByRole('button', { name: /♡ 收藏 1/ }));
  expect(screen.getAllByRole('checkbox', { name: '加入比較' })).toHaveLength(1);
  expect(
    screen.getByRole('heading', { name: '歐系豪華休旅' }),
  ).toBeInTheDocument();
});
