import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './TermsPage.css'; // Chúng ta sẽ dùng file CSS mới bên dưới


function PageHeader() {}

// --- Component chính của trang ---
function TermsPage() {
  const navigate = useNavigate();
 
  const [activeTab, setActiveTab] = useState('terms');

  const renderContent = () => {
    switch (activeTab) {
      case 'terms':
        return (
          <section>
            <h1>Điều khoản sử dụng</h1>
            <p className="last-updated">Cập nhật lần cuối: 21/10/2025</p>

            <h2>Điều 1: Giới thiệu</h2>
            <p>
              Chào mừng Quý Khách hàng đến với Sàn giao dịch thương mại điện tử TOPTICKET (bao
              gồm website và ứng dụng di động) bao gồm: (i) website thương mại điện tử Topticket.vn
              được đăng ký và hoạt động như một website thương mại điện tử và (ii) ứng dụng di động
              trên hệ điều hành Android và iOS có tên là TOPTICKET được đăng ký là một ứng dụng
              thương mại điện tử để các thương nhân, tổ chức, cá nhân khác có thể tiến hành toàn bộ
              quy trình mua bán hàng hóa, dịch vụ trên đó theo hình thức hoạt động là: Website/ứng
              dụng cho phép người tham gia được mở các gian hàng để trưng bày, giới thiệu hàng hóa
              hoặc dịch vụ và Khách hàng thực hiện mua sắm trên đó. Điều khoản sử dụng này bao
              gồm điều khoản (“Điều khoản sử dụng”) mang tính ràng buộc pháp lý giữa Khách hàng
              (“Khách hàng” hoặc “bạn”) và Công ty TNHH TOPTICKET, một công ty sở hữu, điều
              hành và cung cấp đa dạng các loại hình dịch vụ tuỳ thuộc vào mức độ yêu cầu của bạn.
              <p>Trước khi sử dụng dịch vụ của Sàn thương mại điện tử TOPTICKET, Khách hàng cần đọc và
              chấp thuận điều khoản, điều kiện, quy định, chính sách hoặc thủ tục được quy định trong
              Điều khoản sử dụng này. Quý khách hàng cam kết và đồng ý rằng: (i) sử dụng dịch vụ
              của Sàn thương mại điện tử Ticketbox một trung thực trên cơ sở tuân thủ quy định của
              pháp luật; (ii) đảm bảo bất kỳ thông tin hoặc dữ liệu được đăng tải hoặc tạo ra trên Sàn
              thương mại điện tử TOPTICKET chính xác và hoàn toàn chịu trách nhiệm đối với thông tin
              và dữ liệu đó.</p>
              <p>Nếu như Khách hàng không đồng ý với những điều khoản, điều kiện, quy định, chính
              sách hoặc thủ tục được nêu ra dưới đây, vui lòng không sử dụng dịch vụ của chúng tôi.
              Điều khoản sử dụng có thể được sửa đổi theo như quy định tại mục 2 dưới đây</p>
            </p>
            <h2>Điều 2: Tài khoản người dùng</h2>
            <p>
             Khi truy cập vào Sàn thương mại điện tử của chúng tôi (bao gồm website và ứng dụng di
            động), Khách hàng phải đảm bảo đủ 18 tuổi, hoặc truy cập dưới sự giám sát của cha mẹ
            hay người giám hộ hợp pháp. Khách hàng đảm bảo có đầy đủ hành vi dân sự để thực hiện
            các giao dịch mua bán hàng hóa theo quy định hiện hành của pháp luật Việt Nam.</p>
            <p>Chúng tôi sẽ cấp một tài khoản (Account) sử dụng để khách hàng có thể mua sắm trên
            Sàn thương mại điện tử TOPTICKET trong khuôn khổ Điều khoản sử dụng này.</p>
            <p>Quý khách hàng sẽ phải đăng ký tài khoản với thông tin xác thực về bản thân và phải cập
            nhật nếu có bất kỳ thay đổi nào. Mỗi người truy cập phải có trách nhiệm với mật khẩu, tài
            khoản và hoạt động của mình trên Sàn thương mại điện tử Ticketbox. Hơn nữa, quý
            khách hàng phải thông báo cho chúng tôi biết khi tài khoản bị truy cập trái phép. Chúng
            tôi không chịu bất kỳ trách nhiệm nào, dù trực tiếp hay gián tiếp, đối với những thiệt hại
            hoặc mất mát gây ra do quý khách không tuân thủ quy định.</p>
            <p>Nghiêm cấm sử dụng bất kỳ phần nào của website/ứng dụng này với mục đích thương
            mại hoặc nhân danh bất kỳ đối tác thứ ba nào nếu không được chúng tôi cho phép bằng
            văn bản. Nếu vi phạm bất cứ điều nào trong đây, chúng tôi sẽ hủy tài khoản của khách mà
            không cần báo trước.</p>
            <p>Trong suốt quá trình đăng ký, quý khách đồng ý nhận email quảng cáo từ website/ứng
            dụng. Nếu không muốn tiếp tục nhận mail, quý khách có thể từ chối bằng cách nhấp vào
            đường link ở dưới cùng trong mọi email quảng cáo.

            </p>
            {/* Thêm nội dung... */}
          </section>
        );
      case 'privacy':
        return (
          <section>
            <h1>Chính sách bảo mật</h1>
            <p className="last-updated">Cập nhật lần cuối: 21/10/2025</p>

            <h2>1. Thu thập thông tin</h2>
            <strong>
              Chúng tôi thu thập thông tin cá nhân chỉ cần thiết nhằm phục vụ cho các mục đích:</strong>

              <p>Đơn Hàng: để xử lý các vấn đề liên quan đến đơn đặt hàng của thành viên;</p>

              <p>Duy Trì Tài Khoản: để tạo và duy trình tài khoản của thành viên với chúng tôi, bao gồm cả các chương trình khách hàng thân thiết hoặc các chương trình thưởng đi kèm với tài khoản của thành viên;</p>

              <p>Dịch Vụ Người Tiêu Dùng, Dịch Vụ Chăm Sóc Khách Hàng: bao gồm các phản hồi cho các yêu cầu, khiếu nại và phản hồi của thành viên;</p>

              <p>Cá Nhân Hóa: Chúng tôi có thể tổ hợp dữ liệu được thu thập để có một cái nhìn hoàn chỉnh hơn về một người tiêu dùng và từ đó cho phép chúng tôi phục vụ tốt hơn với sự cá nhân hóa mạnh hơn ở các khía cạnh, bao gồm nhưng không giới hạn: (i) để cải thiện và cá nhân hóa trải nghiệm của thành viên trên STMĐT TOPTICKET. (ii) để cải thiện các tiện ích, dịch vụ, điều chỉnh chúng phù hợp với các nhu cầu được cá thể hóa và đi đến những ý tưởng dịch vụ mới (iii) để phục vụ thành viên với những giới thiệu, quảng cáo được điều chỉnh phù hợp với sự quan tâm của thành viên.</p>

              <p>An Ninh: cho các mục đích ngăn ngừa các hoạt động phá hủy tài khoản người dùng của khách hàng hoặc các hoạt động giả mạo khách hàng. Theo yêu cầu của pháp luật: tùy quy định của pháp luật vào từng thời điểm, chúng tôi có thể thu thập, lưu trữ và cung cấp theo yêu cầu của cơ quan nhà nước có thẩm quyền.</p>

              <p>Theo yêu cầu của pháp luật: tùy quy định của pháp luật vào từng thời điểm, chúng tôi có thể thu thập, lưu trữ và cung cấp theo yêu cầu của cơ quan nhà nước có thẩm quyền.</p>
           
            <h2>2. Sử dụng thông tin</h2>
            <strong>
              Thông tin của bạn được sử dụng để xử lý đơn hàng, cung cấp hỗ trợ
              khách hàng, và gửi các thông báo quan trọng về sự kiện hoặc tài 
              khoản của bạn.
            </strong>
            <p>
              Cung cấp các dịch vụ đến Thành viên;

              <p>Gửi các thông báo về các hoạt động trao đổi thông tin giữa thành viên và Sàn thương mại điện tử Topticket;</p>

              <p>Ngăn ngừa các hoạt động phá hủy tài khoản người dùng của thành viên hoặc các hoạt động giả mạo Thành viên;</p>

              <p>Liên lạc và giải quyết với thành viên trong những trường hợp đặc biệt.</p>

              <p>Không sử dụng thông tin cá nhân của thành viên ngoài mục đích xác nhận và liên hệ có liên quan đến giao dịch tại TOPTICKET.</p>

              <p>Trong trường hợp có yêu cầu của pháp luật: STMĐT TOPTICKET có trách nhiệm hợp tác cung cấp thông tin cá nhân thành viên khi có yêu cầu từ cơ quan tư pháp bao gồm: Viện kiểm sát, tòa án, cơ quan công an điều tra liên quan đến hành vi vi phạm pháp luật nào đó của thành viên. Ngoài ra, không ai có quyền xâm phạm vào thông tin cá nhân của thành viên.</p>
            </p>
          </section>
        );
      case 'about':
        return (
          <section>
            <h1>Giới thiệu TOPTICKET</h1>
            <p className="last-updated">Cập nhật lần cuối: 21/10/2025</p>

            <h2>Sứ mệnh của chúng tôi</h2>
            <p>
              TOPTICKET là nền tảng phân phối vé sự kiện hàng đầu Việt Nam, 
              mang đến giải pháp toàn diện cho cả nhà tổ chức và người tham dự. 
              Chúng tôi cam kết mang lại trải nghiệm mua vé dễ dàng, an toàn và 
              tiện lợi.
            </p>
          </section>
        );
      default:
        return null;
    }
  };

  return (
    <div className="terms-page-wrapper">
      <PageHeader />
      
      <div className="terms-container-layout">
        
        {/* === Sidebar Điều Hướng === */}
        <aside className="terms-sidebar">
          <button className="back-btn-terms" onClick={() => navigate(-1)}>
            ← Quay lại
          </button>
          
          <nav className="terms-nav">
            <h4>Về TOPTICKET</h4>
            <a
              className={activeTab === 'about' ? 'active' : ''}
              onClick={() => setActiveTab('about')}
            >
              Giới thiệu
            </a>
            <a
              className={activeTab === 'terms' ? 'active' : ''}
              onClick={() => setActiveTab('terms')}
            >
              Điều khoản sử dụng
            </a>
            <a
              className={activeTab === 'privacy' ? 'active' : ''}
              onClick={() => setActiveTab('privacy')}
            >
              Chính sách bảo mật
            </a>
            {/* Thêm các link khác tại đây */}
          </nav>
        </aside>

       
        <main className="terms-main-content">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}

export default TermsPage;