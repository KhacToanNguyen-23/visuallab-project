package com.edulab.repository;

import com.edulab.model.ExperimentTopic;
import com.edulab.model.SimulationPreset;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public class CurriculumRepositoryImpl implements CurriculumRepository {

    private final List<ExperimentTopic> topics;

    public CurriculumRepositoryImpl() {
        SimulationPreset dcCircuitBasic = new SimulationPreset(
            "preset-dc-basic",
            "Mạch Điện Đơn Giản (Định luật Ohm)",
            "Lắp ráp mạch điện gồm Pin 9V, 1 bóng đèn 10 ohm và công tắc để quan sát dòng electron.",
            "{\"components\":[{\"type\":\"battery\",\"v\":9},{\"type\":\"resistor\",\"r\":10},{\"type\":\"bulb\",\"r\":10}]}"
        );

        SimulationPreset dcCircuitParallel = new SimulationPreset(
            "preset-dc-parallel",
            "Mạch Điện Song Song & Nối Tiếp",
            "Khảo sát cường độ dòng điện I và hiệu điện thế U trong mạch điện hỗn hợp.",
            "{\"components\":[{\"type\":\"battery\",\"v\":12},{\"type\":\"resistor\",\"r\":20},{\"type\":\"resistor\",\"r\":20}]}"
        );

        SimulationPreset pendulumBasic = new SimulationPreset(
            "preset-pendulum",
            "Dao Động Con Lắc Đơn",
            "Khảo sát chu kỳ T phụ thuộc vào chiều dài l và gia tốc trọng trường g.",
            "{\"length\":1.0,\"mass\":1.0,\"gravity\":9.81}"
        );

        SimulationPreset opticsRefraction = new SimulationPreset(
            "preset-optics",
            "Khúc Xạ Ánh Sáng & Thấu Kính Hội Tụ",
            "Quan sát đường truyền tia sáng qua thấu kính và xác định vị trí ảnh ảo/ảnh thật.",
            "{\"focalLength\":15,\"objectDistance\":30}"
        );

        this.topics = List.of(
            new ExperimentTopic(
                "dien-hoc",
                "Điện học & Mạch Điện DC",
                "THCS (Lớp 9) & THPT (Lớp 11)",
                "Điện học",
                "Thí nghiệm lắp ráp mạch điện, định luật Ohm, ampe kế, von kế và định luật Kirchhoff.",
                List.of(dcCircuitBasic, dcCircuitParallel)
            ),
            new ExperimentTopic(
                "co-hoc-dao-dong",
                "Cơ học & Dao động",
                "THPT (Lớp 10 - Lớp 11)",
                "Cơ học",
                "Thí nghiệm con lắc đơn, con lắc lò xo, đồ thị dao động theo thời gian.",
                List.of(pendulumBasic)
            ),
            new ExperimentTopic(
                "quang-hoc",
                "Quang học & Thấu kính",
                "THCS (Lớp 9) & THPT (Lớp 11)",
                "Quang học",
                "Khúc xạ ánh sáng, thấu kính hội tụ, thấu kính phân kỳ và đường truyền tia sáng laser.",
                List.of(opticsRefraction)
            )
        );
    }

    @Override
    public List<ExperimentTopic> findAllTopics() {
        return topics;
    }

    @Override
    public Optional<ExperimentTopic> findTopicById(String id) {
        return topics.stream()
            .filter(topic -> topic.id().equalsIgnoreCase(id))
            .findFirst();
    }
}
